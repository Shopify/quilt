import {Context} from 'koa';

import {OAuthStartOptions, AccessMode, NextFunction} from '../types';
import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';

const DEFAULT_ACCESS_MODE: AccessMode = 'online';

export default function createShopifyAuth(options: OAuthStartOptions) {
  const config = {
    scopes: [],
    prefix: '',
    accessMode: DEFAULT_ACCESS_MODE,
    ...options,
  };

  const {prefix} = config;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthStart = createOAuthStart(config);

  const oAuthCallbackPath = `${oAuthStartPath}/callback`;
  const oAuthCallback = createOAuthCallback(config);

  return async function shopifyAuth(ctx: Context, next: NextFunction) {
    if (ctx.path === oAuthStartPath) {
      await oAuthStart(ctx);
      return;
    }

    if (ctx.path === oAuthCallbackPath) {
      await oAuthCallback(ctx);
      return;
    }

    await next();
  };
}

export {default as Error} from './errors';
export {default as validateHMAC} from './validate-hmac';
