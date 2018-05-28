import {Context} from 'koa';

export function getQueuingTime(ctx: Context): number | null {
  const requestQueuingTime = ctx.request.get('X-Request-Start');
  if (requestQueuingTime) {
    try {
      return parseInt(requestQueuingTime, 10);
    } catch (err) {
      // this is a non-critical error, so we can continue execution.
    }
  }
  return null;
}
