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

  const OAuthStart = {
    path: `${prefix}/auth`,
    callback: createOAuthStart(config),
  };

  const OAuthCallback = {
    path: `${OAuthStart.path}/callback`,
    callback: createOAuthCallback(config),
  };

  return function shopifyAuthRouter(ctx: Context) {
    if (ctx.path === OAuthStart.path) {
      OAuthStart.callback(ctx);
      return;
    }

    if (ctx.path === OAuthCallback.path) {
      OAuthCallback.callback(ctx);
    }
  };
}
