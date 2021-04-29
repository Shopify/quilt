import {Context, Next} from 'koa';

export const HEADER = 'x-quilt-data';

export async function quiltDataMiddleware(ctx: Context, next: Next) {
  const rawQuiltData = ctx.headers[HEADER];
  if (rawQuiltData) {
    ctx.state.quiltData = JSON.parse(rawQuiltData as string);
  }
  await next();
}
