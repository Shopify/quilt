import {Context} from 'koa';

export function getQueuingTime(ctx: Context): number | null {
  const requestStartHeader = ctx.request.get('X-Request-Start');
  if (requestStartHeader) {
    try {
      return parseInt(requestStartHeader.replace('t=', ''), 10);
    } catch (err) {
      // this is a non-critical error, so we can continue execution.
    }
  }
  return null;
}
