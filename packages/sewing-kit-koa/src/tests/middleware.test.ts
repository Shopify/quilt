import {createMockContext} from '@shopify/jest-koa-mocks';
import middleware from '../middleware';
import Assets from '../assets';

describe('middleware', () => {
  it('adds an instance of Assets with the specified assetHost to state', async () => {
    const assetHost = '/sewing-kit-assets/';
    const context = createMockContext();
    await middleware({assetHost})(context, () => Promise.resolve());

    expect(context.state).toHaveProperty('assets');
    expect(context.state.assets).toBeInstanceOf(Assets);
    expect(context.state.assets).toHaveProperty('assetHost', assetHost);
  });

  it('defaults the asset host to Sewing Kit’s dev server', async () => {
    const context = createMockContext();
    await middleware()(context, () => Promise.resolve());
    expect(context.state.assets).toHaveProperty(
      'assetHost',
      'http://localhost:8080/webpack/assets/',
    );
  });

  it('defaults the asset host to /assets/ when serveAssets is true', async () => {
    const context = createMockContext();
    await middleware({serveAssets: true})(context, () => Promise.resolve());
    expect(context.state.assets).toHaveProperty('assetHost', '/assets/');
  });

  it('calls the next middleware', async () => {
    const next = jest.fn(() => Promise.resolve());
    await middleware()(createMockContext(), next);
    expect(next).toHaveBeenCalled();
  });
});
