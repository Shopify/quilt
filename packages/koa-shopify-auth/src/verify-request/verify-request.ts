import {Context} from 'koa';
import {Method, Header, StatusCode} from '@shopify/network';
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
    const redirect = `${authRoute}?shop=${shop}`;

    if (session && session.accessToken) {
      ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME);
      // If a user has installed the store previously on their shop, the accessToken can be stored in session.
      // we need to check if the accessToken is valid, and the only way to do this is by hitting the api.
      const response = await fetch(
        `https://${session.shop}/admin/metafields.json`,
        {
          method: Method.Post,
          headers: {
            [Header.ContentType]: 'application/json',
            'X-Shopify-Access-Token': session.accessToken,
          },
        },
      );

      if (response.status === StatusCode.Unauthorized) {
        ctx.redirect(redirect);
        return;
      }

      await next();
      return;
    }

    ctx.cookies.set(TEST_COOKIE_NAME, '1');

    if (shop) {
      ctx.redirect(redirect);
      return;
    }

    ctx.redirect(fallbackRoute);
  };
}
