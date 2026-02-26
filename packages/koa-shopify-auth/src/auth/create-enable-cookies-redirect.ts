import {Context} from 'koa';

import createTopLevelRedirect from './create-top-level-redirect';
import {TEST_COOKIE_NAME} from './index';

export default function createEnableCookiesRedirect(path: string) {
  const redirect = createTopLevelRedirect(path);

  return function topLevelOAuthRedirect(ctx: Context) {
    // This is to avoid a redirect loop if the app doesn't use verifyRequest or set the test cookie elsewhere.
    ctx.cookies.set(TEST_COOKIE_NAME, '1');
    redirect(ctx);
  };
}
