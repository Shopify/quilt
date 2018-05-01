import {createMockContext} from '@shopify/jest-koa-mocks';
import koaShopifyGraphQLProxy, {
  SessionContext,
  GRAPHQL_PATH,
  PROXY_BASE_PATH,
} from '..';

jest.mock('koa-better-http-proxy', () => {
  return jest.fn(() => jest.fn());
});

const proxyFactory = require.requireMock('koa-better-http-proxy');

describe('koa-shopify-graphql-proxy', () => {
  beforeEach(() => {
    proxyFactory.mockClear();
  });

  it('throws when no session is provided', async () => {
    const ctx: SessionContext = createMockContext({
      url: PROXY_BASE_PATH,
      throw: jest.fn(),
    }) as any;

    await koaShopifyGraphQLProxy(ctx, jest.fn());

    expect(ctx.throw).toBeCalledWith(403, 'Unauthorized');
  });

  it('throws when no accessToken is on session', async () => {
    const ctx: SessionContext = createMockContext({
      url: PROXY_BASE_PATH,
      throw: jest.fn(),
      session: {shop: 'shop1.myshopify.com'},
    }) as any;

    await koaShopifyGraphQLProxy(ctx, jest.fn());

    expect(ctx.throw).toBeCalledWith(403, 'Unauthorized');
  });

  it('throws when no shop is on session', async () => {
    const ctx: SessionContext = createMockContext({
      url: PROXY_BASE_PATH,
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf'},
    }) as any;

    await koaShopifyGraphQLProxy(ctx, jest.fn());

    expect(ctx.throw).toBeCalledWith(403, 'Unauthorized');
  });

  it('bails and calls next if path does not start with the base url', async () => {
    const ctx: SessionContext = createMockContext({
      url: '/not/graphql',
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop: 'foobarbaz'},
    }) as any;
    const next = jest.fn();

    await koaShopifyGraphQLProxy(ctx as any, next);

    expect(next).toBeCalled();
    expect(proxyFactory).not.toBeCalled();
  });

  it('does not bail or throw when request is for the graphql api', async () => {
    const ctx: SessionContext = createMockContext({
      url: PROXY_BASE_PATH,
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop: 'foobarbaz'},
    }) as any;
    const next = jest.fn();

    await koaShopifyGraphQLProxy(ctx as any, next);

    expect(next).not.toBeCalled();
    expect(ctx.throw).not.toBeCalledWith(403, 'Unauthorized');
  });

  it('configures a custom koa-better-http-proxy', async () => {
    const accessToken = 'asdfasdf';
    const shop = 'i-sell-things.myshopify.com';

    const ctx: SessionContext = createMockContext({
      url: PROXY_BASE_PATH,
      throw: jest.fn(),
      session: {accessToken, shop},
    }) as any;

    await koaShopifyGraphQLProxy(ctx, jest.fn());

    const [host, config] = proxyFactory.mock.calls[0];
    expect(host).toBe(shop);

    expect(config).toMatchObject({
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
      https: true,
      parseReqBody: false,
    });
  });

  it('passes a proxyReqPathResolver that returns full shop url', async () => {
    const shop = 'some-shop.myshopify.com';

    const ctx: SessionContext = createMockContext({
      url: PROXY_BASE_PATH,
      throw: jest.fn(),
      session: {accessToken: 'sdfasdf', shop},
    }) as any;

    await koaShopifyGraphQLProxy(ctx, jest.fn());

    const {proxyReqPathResolver} = proxyFactory.mock.calls[0][1];
    expect(proxyReqPathResolver(ctx)).toBe(`https://${shop}${GRAPHQL_PATH}`);
  });
});
