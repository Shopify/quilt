import {Writable} from 'stream';

import React from 'react';
import {Effect} from '@shopify/react-effect/server';
import {middleware as sewingKitKoaMiddleware} from '@shopify/sewing-kit-koa';
import {createMockContext} from '@shopify/jest-koa-mocks';
import withEnv from '@shopify/with-env';

import {createRender, Context} from '../render';
import {mockMiddleware} from '../../tests/utilities';

const mockAssetsScripts = jest.fn(() => Promise.resolve([{path: 'main.js'}]));
const mockAssetsStyles = jest.fn(() => Promise.resolve([{path: 'main.css'}]));

jest.mock('@shopify/sewing-kit-koa', () => ({
  middleware: jest.fn(() => mockMiddleware),
  getAssets() {
    return {
      styles: mockAssetsStyles,
      scripts: mockAssetsScripts,
    };
  },
}));

describe('createRender', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    mockAssetsScripts.mockClear();
    mockAssetsStyles.mockClear();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('response contains "My cool app"', async () => {
    const myCoolApp = 'My cool app';
    const ctx = createMockContext();

    const renderFunction = createRender(() => <>{myCoolApp}</>);
    await renderFunction(ctx, noop);

    expect(await readStream(ctx.body as NodeJS.ReadableStream)).toContain(
      myCoolApp,
    );
  });

  it.each([
    [
      'as Plain object',
      {
        scripts: [{path: '/extraScript.js'}],
        styles: [{path: '/extraStyle.css'}],
        headMarkup: <script>let ScriptFromHeadMarkup = 1;</script>,
      },
    ],
    [
      'as Function',
      () => ({
        scripts: [{path: '/extraScript.js'}],
        styles: [{path: '/extraStyle.css'}],
        headMarkup: <script>let ScriptFromHeadMarkup = 1;</script>,
      }),
    ],
  ])(
    'response contains data passed in through htmlProps (%s)',
    async (_style, htmlProps) => {
      const myCoolApp = 'My cool app';
      const ctx = createMockContext();

      const renderFunction = createRender(() => <>{myCoolApp}</>, {
        htmlProps,
      });
      await renderFunction(ctx, noop);

      const bodyResult = await readStream(ctx.body as NodeJS.ReadableStream);

      // Assets from manifest are still present
      expect(bodyResult).toContain(
        '<script src="main.js" crossorigin="anonymous" type="text/javascript" defer=""></script>',
      );
      expect(bodyResult).toContain(
        '<link rel="stylesheet" type="text/css" href="main.css" crossorigin="anonymous"/>',
      );

      // Additional script/style assets are added
      expect(bodyResult).toContain(
        '<script src="/extraScript.js" crossorigin="anonymous" type="text/javascript" defer=""></script>',
      );
      expect(bodyResult).toContain(
        '<link rel="stylesheet" type="text/css" href="/extraStyle.css" crossorigin="anonymous"/>',
      );

      // Other props work
      expect(bodyResult).toContain(
        '<script>let ScriptFromHeadMarkup = 1;</script>',
      );
    },
  );

  it('response contains x-quilt-data from headers', async () => {
    const myCoolApp = 'My cool app';
    const data = {foo: 'bar'};
    const ctx = createMockContext({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {'x-quilt-data': JSON.stringify({foo: 'bar'})},
    });

    const renderFunction = createRender(() => <>{myCoolApp}</>);
    await renderFunction(ctx, noop);

    const response = await readStream(ctx.body as NodeJS.ReadableStream);
    expect(response).toContain('quilt-data');
    expect(response).toContain(JSON.stringify(data));
  });

  it('does not clobber proxies in the context object', async () => {
    const headerValue = 'some-value';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const ctx = createMockContext({headers: {'some-header': headerValue}});

    const renderFunction = createRender((ctx) => <>{ctx.get('some-header')}</>);
    await renderFunction(ctx, noop);

    expect(await readStream(ctx.body as NodeJS.ReadableStream)).toContain(
      headerValue,
    );
  });

  it('calls the sewing-kit-koa middleware with the passed in assetPrefix', async () => {
    const assetPrefix = 'path/to/assets';
    const ctx = createMockContext();

    const renderFunction = createRender(() => <></>, {assetPrefix});
    await renderFunction(ctx, noop);

    expect(sewingKitKoaMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({assetPrefix}),
    );
  });

  it('calls the sewing-kit-koa middleware with the passed in assetName', async () => {
    const assetName = 'alternate';
    const ctx = createMockContext();

    const renderFunction = createRender(() => <></>, {assetName});
    await renderFunction(ctx, noop);

    expect(mockAssetsScripts).toHaveBeenCalledWith(
      expect.objectContaining({name: assetName}),
    );
  });

  it('calls the sewing-kit-koa middleware with the a functional assetName', async () => {
    const assetName = (ctx: Context) => ctx.path.replace('/', '');
    const ctx = createMockContext({url: 'http://www.hi.com/hello-hi-hello'});

    const renderFunction = createRender(() => <></>, {assetName});
    await renderFunction(ctx, noop);

    expect(mockAssetsScripts).toHaveBeenCalledWith(
      expect.objectContaining({name: 'hello-hi-hello'}),
    );
  });

  describe('error handling', () => {
    const error = new Error(
      'Look, it broken. This is some meaningful error messsage.',
    );
    const BrokenApp = function () {
      throw error;
    };

    it('returns a body with a meaningful error message in development', () => {
      withEnv('development', async () => {
        const ctx = Object.assign(
          createMockContext({
            requestBody: new Writable(),
          }),
          {locale: ''},
        );

        const renderFunction = createRender(() => <BrokenApp />);
        await renderFunction(ctx, noop);

        expect(
          await readStream(ctx.request.body as NodeJS.ReadableStream),
        ).toContain(error.message);
        expect(
          await readStream(ctx.request.body as NodeJS.ReadableStream),
        ).toContain(error.stack);
      });
    });

    it('throws a 500 with a meaningful error message in production', () => {
      withEnv('production', async () => {
        const ctx = Object.assign(createMockContext(), {locale: ''});
        const noopSpy = () => {};
        const throwSpy = jest
          .spyOn(ctx, 'throw')
          .mockImplementation(noopSpy as any);

        const renderFunction = createRender(() => <BrokenApp />);

        await renderFunction(ctx, noop);

        expect(throwSpy).toHaveBeenCalledWith(500, new Error(error.message));
      });
    });
  });

  describe('afterEachPass()', () => {
    it('is called in the render middleware', async () => {
      const ctx = createMockContext();
      const afterEachPass = jest.fn();
      const renderFunction = createRender(() => <>Markup</>, {afterEachPass});

      await renderFunction(ctx, noop);

      expect(afterEachPass).toHaveBeenCalledTimes(1);
    });
  });

  describe('betweenEachPass()', () => {
    it('is called in the render middleware', async () => {
      const ctx = createMockContext();
      const betweenEachPass = jest.fn();
      const renderFunction = createRender(
        () => (
          <>
            <Effect perform={() => Promise.resolve()} />
          </>
        ),
        {
          betweenEachPass,
        },
      );

      await renderFunction(ctx, noop);

      expect(betweenEachPass.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });
});

function readStream(stream: NodeJS.ReadableStream) {
  return new Promise<string>((resolve) => {
    let response: string;

    stream.on('data', (data) => (response += data));
    stream.on('end', () => resolve(response));
  });
}

async function noop() {}
