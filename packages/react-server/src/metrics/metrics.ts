import {Context} from 'koa';
import compose from 'koa-compose';

import {totalGraphQLTime, GRAPHQL_OPERATIONS} from '@shopify/react-graphql';
import {KoaNextFunction} from '../types';

const MILLIS_PER_SECOND = 1000;
const NANOS_PER_MILLIS = 1e6;
const START_TIME_STATE_KEY = Symbol('startTime');

async function startRequestTiming(ctx: Context, next: KoaNextFunction) {
  ctx.state[START_TIME_STATE_KEY] = process.hrtime();
  await next();
}

async function middleware(ctx: Context, next: KoaNextFunction) {
  try {
    await next();
  } finally {
    const graphQLOperations = ctx.state[GRAPHQL_OPERATIONS];
    const graphQLTime = graphQLOperations
      ? totalGraphQLTime(graphQLOperations)
      : 0;

    const [seconds, nanoseconds] = process.hrtime(
      ctx.state[START_TIME_STATE_KEY],
    );
    const ms = seconds * MILLIS_PER_SECOND + nanoseconds / NANOS_PER_MILLIS;
    const requestTime = Math.round(ms);
    const reactRenderTime = requestTime - graphQLTime;

    const metrics = [
      `ui;request_time=${requestTime}`,
      `ui;graphql_time=${graphQLTime}`,
      `ui;react_rendering=${reactRenderTime}`,
    ];

    const uiMetrics = `${metrics.join(',')}`;
    ctx.set('Server-Timing', uiMetrics);
  }
}

export const metricsMiddleware = compose([startRequestTiming, middleware]);
