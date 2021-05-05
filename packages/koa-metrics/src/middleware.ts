import {Context} from 'koa';
import {StatsDClient, Logger} from '@shopify/statsd';

import {tagsForRequest, tagsForResponse} from './tags';
import {getQueuingTime} from './timing';
import {getContentLength} from './content';
import {initTimer, Timer} from './timer';

export enum CustomMetric {
  ContentLength = 'request_content_length',
  QueuingTime = 'request_queuing_time',
  RequestDuration = 'request_time',
}

export interface Options {
  prefix: string;
  host: string;
  skipInstrumentation?: boolean;
  logger?: Logger;
}

export function metrics({
  prefix,
  host,
  skipInstrumentation = false,
  logger,
}: Options) {
  const statsdHost = host.split(':')[0];
  const statsdPort = parseInt(host.split(':')[1], 10);

  return async function statsdMiddleware(ctx: Context, next: Function) {
    const metrics = new StatsDClient({
      host: statsdHost,
      port: statsdPort,
      prefix,
      globalTags: tagsForRequest(ctx),
      // eslint-disable-next-line no-console
      logger: logger || ctx.log || console.log,
    });

    const promises: Array<Promise<void>> = [];
    let timer: Timer | undefined;

    if (!skipInstrumentation) {
      timer = initTimer();
      const queuingTime = getQueuingTime(ctx);
      if (queuingTime) {
        promises.push(
          metrics.distribution(CustomMetric.QueuingTime, queuingTime),
        );
      }
    }

    // allow later middleware to add metrics
    ctx.metrics = metrics;

    try {
      await next();
    } finally {
      metrics.addGlobalTags(tagsForResponse(ctx));

      if (!skipInstrumentation) {
        if (timer) {
          const duration = timer.stop();
          promises.push(
            metrics.distribution(CustomMetric.RequestDuration, duration),
          );
        }

        const contentLength = getContentLength(ctx);
        if (contentLength) {
          promises.push(
            metrics.distribution(CustomMetric.ContentLength, contentLength),
          );
        }
      }

      await Promise.all(promises);
      await metrics.close();
    }
  };
}
