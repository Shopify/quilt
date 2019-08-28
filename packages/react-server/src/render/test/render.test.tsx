import React from 'react';
import {createMockContext} from '@shopify/jest-koa-mocks';
import withEnv from '@shopify/with-env';
import {Effect} from '@shopify/react-effect/server';
import {createRender, RenderContext} from '../render';

jest.mock('@shopify/sewing-kit-koa', () => ({
  getAssets() {
    return {
      styles: () => Promise.resolve([]),
      scripts: () => Promise.resolve([]),
    };
  },
}));

const meaningfulErrorMessage =
  'Look, it broken. This is some meaningful error messsage.';
const BrokenApp = function() {
  throw new Error(meaningfulErrorMessage);
};

describe('createRender', () => {
  it('response contains "My cool app"', async () => {
    const myCoolApp = 'My cool app';
    const ctx = createMockContext();

    const renderFunction = createRender(() => <>{myCoolApp}</>);
    await renderFunction(ctx as RenderContext);

    expect(await readStream(ctx.body)).toContain(myCoolApp);
  });

  it('in development the body contains a meaningful error messages', () => {
    withEnv('development', async () => {
      const ctx = {...createMockContext(), locale: ''};

      const renderFunction = createRender(() => <BrokenApp />);
      await renderFunction(ctx);

      expect(ctx.body).toContain(meaningfulErrorMessage);
    });
  });

  it('in production it throws a 500 with a meaninful error message', () => {
    withEnv('production', async () => {
      const ctx = {...createMockContext(), locale: ''};
      const throwSpy = jest.spyOn(ctx, 'throw').mockImplementation(() => null);

      const renderFunction = createRender(() => <BrokenApp />);
      await renderFunction(ctx);

      expect(throwSpy).toHaveBeenCalledWith(
        500,
        new Error(meaningfulErrorMessage),
      );
    });
  });

  describe('afterEachPass()', () => {
    it('is called in the render middleware', async () => {
      const ctx = createMockContext();
      const afterEachPass = jest.fn();
      const renderFunction = createRender(() => <>Markup</>, {afterEachPass});

      await renderFunction(ctx);

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

      await renderFunction(ctx);

      expect(betweenEachPass.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });
});

function readStream(stream: NodeJS.ReadableStream) {
  return new Promise<string>(resolve => {
    let response: string;

    stream.on('data', data => (response += data));
    stream.on('end', () => resolve(response));
  });
}
