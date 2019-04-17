import {Context} from 'koa';

import {tagsForRequest, tagsForResponse} from './tags';
import {getQueuingTime} from './timing';
import {getContentLength} from './content';
import Metrics, {Timer, Logger} from './Metrics';

export {Tag} from './tags';

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

export default function metrics({
  prefix,
  host,
  skipInstrumentation = false,
  logger,
}: Options) {
  const statsdHost = host.split(':')[0];
  const statsdPort = parseInt(host.split(':')[1], 10);

  return async function statsdMiddleware(ctx: Context, next: Function) {
    const metrics = new Metrics(
      {
        host: statsdHost,
        port: statsdPort,
        prefix,
        globalTags: tagsForRequest(ctx),
      },
      // eslint-disable-next-line no-console
      logger || ctx.log || console.log,
    );

    const promises: Promise<void>[] = [];
    let timer: Timer | undefined;

    if (!skipInstrumentation) {
      timer = metrics.initTimer();
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
      await metrics.closeClient();
    }
  };
}
