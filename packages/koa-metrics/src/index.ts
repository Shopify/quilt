import {StatsD} from 'hot-shots';
import {Context} from 'koa';

import {tagsForRequest, tagsForResponse} from './tags';
import {initTimer, Timer, getQueuingTime} from './timing';
import {getContentLength} from './content';

export {Tags} from './tags';

export enum Metrics {
  ContentLength = 'request_content_length',
  QueuingTime = 'request_queuing_time',
  RequestDuration = 'request_time',
}

export interface Options {
  prefix: string;
  host: string;
  skipInstrumentation?: boolean;
}

export default function metrics({
  prefix,
  host,
  skipInstrumentation = false,
}: Options) {
  const statsdHost = host.split(':')[0];
  const statsdPort = parseInt(host.split(':')[1], 10);

  return async function statsdMiddleware(ctx: Context, next: Function) {
    const client = new StatsD({
      host: statsdHost,
      port: statsdPort,
      prefix,
      globalTags: tagsForRequest(ctx),
    });

    let timer: Timer | undefined;

    if (!skipInstrumentation) {
      timer = initTimer();
      const queuingTime = getQueuingTime(ctx);
      if (queuingTime) {
        client.timing(Metrics.QueuingTime, queuingTime);
      }
    }

    // allow later middleware to add metrics
    ctx.state.metrics = client;

    try {
      await next();
    } finally {
      const responseClient = client.childClient({
        globalTags: tagsForResponse(ctx),
      });

      if (!skipInstrumentation) {
        if (timer) {
          const duration = timer.stop();
          responseClient.timing(Metrics.RequestDuration, duration);
        }

        const contentLength = getContentLength(ctx);
        if (contentLength) {
          responseClient.histogram(Metrics.ContentLength, contentLength);
        }
      }

      // @ts-ignore According to the hot-shots documentation, callback
      // is not required.
      client.close();
    }
  };
}
