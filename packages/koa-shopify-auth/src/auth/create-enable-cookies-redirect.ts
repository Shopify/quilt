import {Context} from 'koa';

import createTopLevelRedirect from './create-top-level-redirect';
import getCookieOptions from './cookie-options';

import {TEST_COOKIE_NAME} from './index';

export default function createEnableCookiesRedirect(
  apiKey: string,
  path: string,
) {
  const redirect = createTopLevelRedirect(apiKey, path);

  return function topLevelOAuthRedirect(ctx: Context) {
    // This is to avoid a redirect loop if the app doesn't use verifyRequest or set the test cookie elsewhere.
    ctx.cookies.set(TEST_COOKIE_NAME, '1', getCookieOptions(ctx));
    redirect(ctx);
  };
}
