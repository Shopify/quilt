import {Context} from 'koa';
import compose from 'koa-compose';

import {KoaNextFunction} from '../types';

const MILLIS_PER_SECOND = 1000;
const NANOS_PER_MILLIS = 1e6;
const START_TIME_STATE_KEY = Symbol('startTime');

async function startRequestTiming(ctx: Context, next: KoaNextFunction) {
  (ctx.state as any)[START_TIME_STATE_KEY] = process.hrtime();
  await next();
}

async function middleware(ctx: Context, next: KoaNextFunction) {
  try {
    await next();
  } finally {
    const [seconds, nanoseconds] = process.hrtime(
      (ctx.state as any)[START_TIME_STATE_KEY],
    );
    const ms = seconds * MILLIS_PER_SECOND + nanoseconds / NANOS_PER_MILLIS;
    const requestTime = Math.round(ms);

    const uiMetrics = `ui;request_time=${requestTime}`;
    ctx.set('Server-Timing', uiMetrics);
  }
}

export const metricsMiddleware = compose([startRequestTiming, middleware]);
