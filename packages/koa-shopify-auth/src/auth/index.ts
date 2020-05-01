import {Context} from 'koa';

import {OAuthStartOptions, AccessMode, NextFunction} from '../types';

import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import createEnableCookies from './create-enable-cookies';
import createTopLevelOAuthRedirect from './create-top-level-oauth-redirect';
import createRequestStorageAccess from './create-request-storage-access';

const DEFAULT_MYSHOPIFY_DOMAIN = 'myshopify.com';
const DEFAULT_ACCESS_MODE: AccessMode = 'online';

export const TOP_LEVEL_OAUTH_COOKIE_NAME = 'shopifyTopLevelOAuth';
export const TEST_COOKIE_NAME = 'shopifyTestCookie';
export const GRANTED_STORAGE_ACCESS_COOKIE_NAME =
  'shopify.granted_storage_access';

function hasCookieAccess({cookies}: Context) {
  return Boolean(cookies.get(TEST_COOKIE_NAME));
}

function grantedStorageAccess({cookies}: Context) {
  return Boolean(cookies.get(GRANTED_STORAGE_ACCESS_COOKIE_NAME));
}

function shouldPerformInlineOAuth({cookies}: Context) {
  return Boolean(cookies.get(TOP_LEVEL_OAUTH_COOKIE_NAME));
}

export default function createShopifyAuth(options: OAuthStartOptions) {
  const config = {
    scopes: [],
    prefix: '',
    myShopifyDomain: DEFAULT_MYSHOPIFY_DOMAIN,
    accessMode: DEFAULT_ACCESS_MODE,
    ...options,
  };

  const {prefix} = config;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthCallbackPath = `${oAuthStartPath}/callback`;

  const oAuthStart = createOAuthStart(config, oAuthCallbackPath);
  const oAuthCallback = createOAuthCallback(config);

  const inlineOAuthPath = `${prefix}/auth/inline`;
  const topLevelOAuthRedirect = createTopLevelOAuthRedirect(
    config.apiKey,
    inlineOAuthPath,
  );

  const enableCookiesPath = `${oAuthStartPath}/enable_cookies`;
  const enableCookies = createEnableCookies(config);
  const requestStorageAccess = createRequestStorageAccess(config);

  return async function shopifyAuth(ctx: Context, next: NextFunction) {
    ctx.cookies.secure = true;

    if (
      ctx.path === oAuthStartPath &&
      !hasCookieAccess(ctx) &&
      !grantedStorageAccess(ctx)
    ) {
      await requestStorageAccess(ctx);
      return;
    }

    if (
      ctx.path === inlineOAuthPath ||
      (ctx.path === oAuthStartPath && shouldPerformInlineOAuth(ctx))
    ) {
      await oAuthStart(ctx);
      return;
    }

    if (ctx.path === oAuthStartPath) {
      await topLevelOAuthRedirect(ctx);
      return;
    }

    if (ctx.path === oAuthCallbackPath) {
      await oAuthCallback(ctx);
      return;
    }

    if (ctx.path === enableCookiesPath) {
      await enableCookies(ctx);
      return;
    }

    await next();
  };
}

export {default as Error} from './errors';
export {default as validateHMAC} from './validate-hmac';
