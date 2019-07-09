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
    const render = createRender({render: () => <MockApp />});

    await render(context);

    expect(context.body).toMatch(/<!DOCTYPE html><html lang="en">/);
    expect(context.body).toMatch(/<div>markup<\/div>/);
  });
});

function createRenderContext(): RenderContext {
  const context = createMockContext();

  setLogger(context, new Logger(mockLogger));

  return context;
}

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
};
