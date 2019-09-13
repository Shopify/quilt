import {Context} from 'koa';
import {Method, StatusCode} from '@shopify/network';

export async function secureRequest(ctx: Context, next: Function) {
  if (ctx.secure) {
    await next();
    return;
  }

  if (ctx.method === Method.Get) {
    const redirectLocation = `https://${ctx.host}${ctx.request.originalUrl}`;
    ctx.status = StatusCode.MovedPermanently;
    ctx.redirect(redirectLocation);
  } else {
    ctx.status = StatusCode.Forbidden;
    ctx.body = {error: 'This server only accepts requests via HTTPS.'};
  }
}
