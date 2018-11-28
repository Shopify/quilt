import {createMockContext} from '@shopify/jest-koa-mocks';
import koaShopifyGraphQLProxy, {GRAPHQL_PATH, PROXY_BASE_PATH} from '..';

jest.mock('koa-better-http-proxy', () => {
  return jest.fn(() => jest.fn());
});

const proxyFactory = require.requireMock('koa-better-http-proxy');

describe('koa-shopify-graphql-proxy', () => {
  beforeEach(() => {
    proxyFactory.mockClear();
  });

  it('throws when no session is provided', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
    });

    await koaShopifyGraphQLProxyMiddleware(ctx, jest.fn());

    expect(ctx.throw).toBeCalledWith(403, 'Unauthorized');
  });

  it('throws when no accessToken is on session', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();

    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
      session: {shop: 'shop1.myshopify.com'},
    });

    await koaShopifyGraphQLProxyMiddleware(ctx, jest.fn());

    expect(ctx.throw).toBeCalledWith(403, 'Unauthorized');
  });

  it('throws when no shop is on session', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf'},
    });

    await koaShopifyGraphQLProxyMiddleware(ctx, jest.fn());

    expect(ctx.throw).toBeCalledWith(403, 'Unauthorized');
  });

  it('bails and calls next if method is not POST', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const ctx = createMockContext({
      url: '/graphql',
      method: 'GET',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop: 'foobarbaz'},
    });
    const nextSpy = jest.fn();

    await koaShopifyGraphQLProxyMiddleware(ctx, nextSpy);

    expect(nextSpy).toBeCalled();
    expect(proxyFactory).not.toBeCalled();
  });

  it('bails and calls next if path does not start with the base url', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const ctx = createMockContext({
      url: '/not/graphql',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop: 'foobarbaz'},
    });
    const nextSpy = jest.fn();

    await koaShopifyGraphQLProxyMiddleware(ctx, nextSpy);

    expect(nextSpy).toBeCalled();
    expect(proxyFactory).not.toBeCalled();
  });

  it('bails and calls next if path does not start with the base url and no session', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const ctx = createMockContext({
      url: '/not/graphql',
      throw: jest.fn(),
    });
    const nextSpy = jest.fn();

    await koaShopifyGraphQLProxyMiddleware(ctx, nextSpy);

    expect(nextSpy).toBeCalled();
    expect(proxyFactory).not.toBeCalled();
  });

  it('does not bail or throw when request is for the graphql api', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop: 'foobarbaz'},
    });
    const nextSpy = jest.fn();

    await koaShopifyGraphQLProxyMiddleware(ctx, nextSpy);

    expect(nextSpy).not.toBeCalled();
    expect(ctx.throw).not.toBeCalledWith(403, 'Unauthorized');
  });

  it('configures a custom koa-better-http-proxy', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const accessToken = 'asdfasdf';
    const shop = 'i-sell-things.myshopify.com';

    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
      session: {accessToken, shop},
    });

    await koaShopifyGraphQLProxyMiddleware(ctx, jest.fn());

    const [host, config] = proxyFactory.mock.calls[0];
    expect(host).toBe(shop);

    expect(config).toMatchObject({
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      https: true,
      parseReqBody: false,
    });
  });

  it('configures a custom koa-better-http-proxy with private app credentials from the options', async () => {
    const password = 'sdfghsdghsh';
    const shop = 'i-sell-things.myshopify.com';
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy({
      password,
      shop,
    });

    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
    });

    await koaShopifyGraphQLProxyMiddleware(ctx, jest.fn());

    const [host, config] = proxyFactory.mock.calls[0];
    expect(host).toBe(shop);

    expect(config).toMatchObject({
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': password,
      },
      https: true,
      parseReqBody: false,
    });
  });

  it('passes a proxyReqPathResolver that returns full shop url', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const shop = 'some-shop.myshopify.com';

    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop},
    });

    await koaShopifyGraphQLProxyMiddleware(ctx, jest.fn());

    const {proxyReqPathResolver} = proxyFactory.mock.calls[0][1];
    expect(proxyReqPathResolver(ctx)).toBe(`https://${shop}${GRAPHQL_PATH}`);
  });

  it('terminates middleware chain when proxying (does not call next)', async () => {
    const koaShopifyGraphQLProxyMiddleware = koaShopifyGraphQLProxy();
    const shop = 'some-shop.myshopify.com';

    const ctx = createMockContext({
      url: PROXY_BASE_PATH,
      method: 'POST',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop},
    });
    const nextSpy = jest.fn();

    await koaShopifyGraphQLProxyMiddleware(ctx, nextSpy);
    expect(nextSpy).not.toBeCalled();
  });
});
