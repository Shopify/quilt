import {Context} from 'koa';

export default function ping() {
  return async function pingMiddleware(ctx: Context, next: Function) {
    if (ctx.path === '/ping') {
      ctx.status = 200;
      return;
    }
    await next();
  };
}
