import proxy from 'koa-better-http-proxy';
import {Context} from 'koa';

export interface SessionContext extends Context {
  session?: {accessToken?: string; shop?: string};
}

export const PROXY_BASE_PATH = '/graphql';
export const GRAPHQL_PATH = '/admin/api/graphql.json';

export default async function shopifyGraphQLProxy(
  ctx: SessionContext,
  next: () => Promise<any>,
) {
  const {session = {}} = ctx;
  const {accessToken, shop} = session;

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
    proxyReqPathResolver() {
      return `https://${shop}${GRAPHQL_PATH}`;
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
}

async function noop() {}
