import React from 'react';
import {createMockContext} from '@shopify/jest-koa-mocks';
import withEnv from '@shopify/with-env';
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

    expect(ctx.body).toContain(myCoolApp);
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
});
