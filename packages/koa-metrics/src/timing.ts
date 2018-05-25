import {Context} from 'koa';

export interface Timer {
  stop(): number;
}

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

export function initTimer(): Timer {
  const startTime = process.hrtime();

  function stop() {
    const duration = process.hrtime(startTime);
    const [seconds, nanoseconds] = duration;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    return Math.round(milliseconds);
  }

  return {stop};
}
