import {Context} from 'koa';

import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import {Options} from './types';

export default function createShopifyAuth(options: Options) {
  const config = {
    scopes: [],
    accessMode: 'online',
    ...options,
  };

  const {prefix} = options;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthStart = createOAuthStart(config);

  const oAuthCallbackPath = `${oAuthStartPath}/callback`;
  const oAuthCallback = createOAuthCallback(config);

  return async function shopifyAuth(ctx: Context) {
    if (ctx.path === oAuthStartPath) {
      await oAuthStart(ctx);
      return;
    }

    if (ctx.path === oAuthCallbackPath) {
      await oAuthCallback(ctx);
    }
  };
}
