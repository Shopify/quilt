import React from 'react';
import {createMockContext} from '@shopify/jest-koa-mocks';
import {createRender, RenderContext} from '../render';

describe('createRender()', () => {
  function MockApp() {
    return <div>markup</div>;
  }

  it('renders the return value of a given function and adds the result to the server context body', async () => {
    const context = createRenderContext();
    const render = createRender(() => <MockApp />);

    await render(context);

    expect(context.body).toMatch(/<html lang="en" data-reactroot="">/);
    expect(context.body).toMatch(/<div>markup<\/div>/);
  });
});

function createRenderContext(): RenderContext {
  return createMockContext();
}
