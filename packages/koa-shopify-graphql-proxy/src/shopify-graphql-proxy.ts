import proxy from 'koa-better-http-proxy';
import {Context} from 'koa';

export const PROXY_BASE_PATH = '/graphql';
export const GRAPHQL_PATH_PREFIX = '/admin/api';

export type ApiVersion =
  | '2021-10'
  | '2022-01'
  | '2022-04'
  | '2022-07'
  | 'unstable'
  | 'unversioned'
  | (string & {});

interface DefaultProxyOptions {
  version: ApiVersion;
}

interface PrivateShopOption extends DefaultProxyOptions {
  password: string;
  shop: string;
}

type ProxyOptions = PrivateShopOption | DefaultProxyOptions;

export default function shopifyGraphQLProxy(proxyOptions: ProxyOptions) {
  return async function shopifyGraphQLProxyMiddleware(
    ctx: Context,
    next: () => Promise<any>,
  ) {
    const {session = {}} = ctx;

    const shop = 'shop' in proxyOptions ? proxyOptions.shop : session.shop;
    const accessToken =
      'password' in proxyOptions ? proxyOptions.password : session.accessToken;
    const version = proxyOptions.version;

    if (ctx.path !== PROXY_BASE_PATH || ctx.method !== 'POST') {
      await next();
      return;
    }

    if (accessToken == null || shop == null) {
      ctx.throw(403, 'Unauthorized');
      return;
    }

    await proxy(shop, {
      https: true,
      parseReqBody: false,
      // Setting request header here, not response. That's why we don't use ctx.set()
      // proxy middleware will grab this request header
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      proxyReqOptDecorator(proxyReqOpts) {
        delete proxyReqOpts.headers.cookie;
        delete proxyReqOpts.headers.Cookie;
        return proxyReqOpts;
      },
      proxyReqPathResolver() {
        return `${GRAPHQL_PATH_PREFIX}/${version}/graphql.json`;
      },
    })(
      ctx,

      /*
        We want this middleware to terminate, not fall through to the next in the chain,
        but sadly it doesn't support not passing a `next` function. To get around this we
        just pass our own dummy `next` that resolves immediately.
      */
      noop,
    );
  };
}

async function noop() {}
