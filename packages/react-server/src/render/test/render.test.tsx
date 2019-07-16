import React from 'react';
import {createMockContext} from '@shopify/jest-koa-mocks';
import {createRender, RenderContext} from '../render';
import {setLogger, Logger} from '../../logger';

jest.mock('@shopify/sewing-kit-koa', () => ({
  getAssets() {
    return {
      styles: () => Promise.resolve([]),
      scripts: () => Promise.resolve([]),
    };
  },
}));

describe('createRender()', () => {
  function MockApp() {
    return <div>markup</div>;
  }

  it('renders the return value of a given function and adds the result to the server context body', async () => {
    const context = createRenderContext();
    const render = createRender(() => <MockApp />);

    await render(context);

    expect(context.body).toBe(
      `<!DOCTYPE html><html lang="fr"><head><meta charSet="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="never"/></head><body><div id="app"><div>markup</div></div></body></html>`,
    );
  });
});

function createRenderContext(): RenderContext {
  const context = createMockContext();

  setLogger(context, new Logger());

  return context;
}
