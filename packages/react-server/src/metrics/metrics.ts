import {Context} from 'koa';
import compose from 'koa-compose';

import {KoaNextFunction} from '../types';

const START_TIME_STATE_KEY = Symbol('startTime');

async function startStatsd(ctx: Context, next: KoaNextFunction) {
  ctx.state[START_TIME_STATE_KEY] = process.hrtime();
  await next();
}

async function middleware(ctx: Context, next: KoaNextFunction) {
  try {
    await next();
  } finally {
    const [seconds, nanoseconds] = process.hrtime(
      ctx.state[START_TIME_STATE_KEY],
    );
    const ms = seconds * 1000 + nanoseconds / 1e6;
    const requestTime = Math.round(ms);

    ctx.set('X-React-Server-Request-Time', requestTime.toString());
  }
}

export const metricsMiddleware = compose([startStatsd, middleware]);
