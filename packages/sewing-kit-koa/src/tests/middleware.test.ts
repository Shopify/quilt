import {createMockContext} from '@shopify/jest-koa-mocks';
import {Header} from '@shopify/network';
import middleware from '../middleware';
import Assets from '../assets';

describe('middleware', () => {
  it('adds an instance of Assets with the specified assetPrefix to state', async () => {
    const assetPrefix = '/sewing-kit-assets/';
    const context = createMockContext();
    await middleware({assetPrefix})(context, () => Promise.resolve());

    expect(context.state).toHaveProperty('assets');
    expect(context.state.assets).toBeInstanceOf(Assets);
    expect(context.state.assets).toHaveProperty('assetPrefix', assetPrefix);
  });

  it('defaults the asset host to Sewing Kit’s dev server', async () => {
    const context = createMockContext();
    await middleware()(context, () => Promise.resolve());
    expect(context.state.assets).toHaveProperty(
      'assetPrefix',
      'http://localhost:8080/webpack/assets/',
    );
  });

  it('defaults the asset host to /assets/ when serveAssets is true', async () => {
    const context = createMockContext();
    await middleware({serveAssets: true})(context, () => Promise.resolve());
    expect(context.state.assets).toHaveProperty('assetPrefix', '/assets/');
  });

  it('passes the userAgent to the asset', async () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
    const context = createMockContext({
      headers: {[Header.UserAgent]: userAgent},
    });

    await middleware({serveAssets: true})(context, () => Promise.resolve());
    expect(context.state.assets).toHaveProperty('userAgent', userAgent);
  });

  it('calls the next middleware', async () => {
    const next = jest.fn(() => Promise.resolve());
    await middleware()(createMockContext(), next);
    expect(next).toHaveBeenCalled();
  });
});
