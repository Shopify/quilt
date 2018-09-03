import {Context} from 'koa';

import {OAuthStartOptions, AccessMode, NextFunction} from '../types';
import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import createEnableCookies from './create-enable-cookies';
import createTopLevelRedirect from './create-top-level-redirect';

const DEFAULT_ACCESS_MODE: AccessMode = 'online';

const TOP_LEVEL_OAUTH_COOKIE_NAME = 'shopifyTopLevelOAuth';
export const TEST_COOKIE_NAME = 'shopifyTestCookie';

function hasCookieAccess({cookies}: Context) {
  return Boolean(cookies.get(TEST_COOKIE_NAME));
}

function shouldPerformInlineOAuth({cookies}: Context) {
  return Boolean(cookies.get(TOP_LEVEL_OAUTH_COOKIE_NAME));
}

export default function createShopifyAuth(options: OAuthStartOptions) {
  const config = {
    scopes: [],
    prefix: '',
    accessMode: DEFAULT_ACCESS_MODE,
    ...options,
  };

  const {baseUrl, prefix} = config;

  const oAuthStartPath = `${prefix}/auth`;
  const oAuthCallbackPath = `${oAuthStartPath}/callback`;

  const oAuthStart = createOAuthStart(config, oAuthCallbackPath);
  const oAuthCallback = createOAuthCallback(config);

  const inlineOAuthPath = `${prefix}/auth/inline`;
  const redirectToTopLevelOAuth = createTopLevelRedirect(`${baseUrl}${inlineOAuthPath}`);

  const enableCookiesPath = `${oAuthStartPath}/enable_cookies`;
  const enableCookies = createEnableCookies(config);
  const redirectToEnableCookies = createTopLevelRedirect(`${baseUrl}${enableCookiesPath}`);

  return async function shopifyAuth(ctx: Context, next: NextFunction) {
    if (ctx.path === oAuthStartPath && !hasCookieAccess(ctx)) {
      // This is to avoid a redirect loop if the app doesn't use verifyRequest or set the test cookie elsewhere.
      ctx.cookies.set(TEST_COOKIE_NAME, '1');
      await redirectToEnableCookies(ctx);
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
      ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '1');
      await redirectToTopLevelOAuth(ctx);
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
