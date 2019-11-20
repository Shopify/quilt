import {Context} from 'koa';

import {Routes} from './types';

export function redirectToAuth(
  {fallbackRoute, authRoute}: Routes,
  ctx: Context,
) {
  const {
    query: {shop},
  } = ctx;

  const routeForRedirect =
    shop == null ? fallbackRoute : `${authRoute}?shop=${shop}`;

  ctx.redirect(routeForRedirect);
}

export function clearSession(ctx: Context) {
  delete ctx.session.shop;
  delete ctx.session.accessToken;
}
