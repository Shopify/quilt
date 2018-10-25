import {Context} from 'koa';

import {NextFunction, Cookies} from '../types';

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
      ctx.cookies.set(Cookies.topLevel);
      await next();
      return;
    }

    ctx.cookies.set(Cookies.test, '1');

    if (shop) {
      ctx.redirect(`${authRoute}?shop=${shop}`);
      return;
    }

    ctx.redirect(fallbackRoute);
  };
}
