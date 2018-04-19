import {Context} from 'koa';

import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import {Options, AccessMode} from './types';

const DEFAULT_ACCESS_MODE: AccessMode = 'online';

export default function createShopifyAuth(options: Options) {
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

export {default as Error} from './errors';
export {default as validateHMAC} from './validate-hmac';
