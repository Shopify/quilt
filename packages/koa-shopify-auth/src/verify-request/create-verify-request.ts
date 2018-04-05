import {Context} from 'koa';

export interface Options {
  authRoute?: string;
  fallbackRoute?: string;
}

export default function createVerifyRequest({
  authRoute = '/auth',
  fallbackRoute = '/install',
}: Options = {}) {
  return function verifyRequest(ctx: Context, next) {
    const {query: {shop}, session} = ctx;

    if (session && session.accessToken) {
      return next();
    }

    if (shop) {
      return ctx.redirect(`${authRoute}?shop=${shop}`);
    }

    return ctx.redirect(fallbackRoute);
  };
}
