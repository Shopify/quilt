import {Context} from 'koa';

import {NextFunction} from '../types';
import {TEST_COOKIE_NAME, TOP_LEVEL_OAUTH_COOKIE_NAME} from '../index';

export interface Options {
  authRoute?: string;
  fallbackRoute?: string;
}

export default function verifyRequest({
  authRoute = '/auth',
  fallbackRoute = '/auth',
}: Options = {}) {
  return async function verifyRequestMiddleware(
    ctx: Context,
    next: NextFunction,
  ) {
    const {
      query: {shop},
      session,
    } = ctx;

    if (session && session.accessToken) {
      ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME);
      await next();
      return;
    }

    ctx.cookies.set(TEST_COOKIE_NAME, '1');

    if (shop) {
      ctx.redirect(`${authRoute}?shop=${shop}`);
      return;
    }

    ctx.redirect(fallbackRoute);
  };
}
