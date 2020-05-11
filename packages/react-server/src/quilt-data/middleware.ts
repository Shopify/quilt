import {Context, Next} from 'koa';

export const HEADER = 'x-quilt-data';

export async function quiltDataMiddleware(ctx: Context, next: Next) {
  if (ctx.headers[HEADER]) {
    ctx.state.quiltData = JSON.parse(ctx.headers[HEADER]);
  }
  await next();
}
