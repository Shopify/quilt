import {Context} from 'koa';

import createTopLevelRedirect from './create-top-level-redirect';
import {Cookies} from '../types';

export default function createCookieRedirect(path: string, cookie: Cookies) {
  const redirect = createTopLevelRedirect(path);

  return function topLevelOAuthRedirect(ctx: Context) {
    // This is to avoid a redirect loop if the app doesn't use verifyRequest or set the test cookie elsewhere.
    ctx.cookies.set(cookie, '1');
    redirect(ctx);
  };
}
