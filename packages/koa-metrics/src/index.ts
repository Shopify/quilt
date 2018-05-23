import {StatsD} from 'hot-shots';
import {Context} from 'koa';

import {tagsForRequest, tagsForResponse} from './tags';
import {initTimer} from './timing';
import {instrumentContentLength} from './content';

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

    let timer;

    if (!skipInstrumentation) {
      timer = initTimer(client, ctx);
    }

    // allow later middleware to add metrics
    ctx.state.statsd = client;

    try {
      await next();
    } finally {
      const responseClient = client.childClient({
        globalTags: tagsForResponse(ctx),
      });

      if (!skipInstrumentation) {
        timer.close(responseClient);
        instrumentContentLength(responseClient, ctx);
      }

      // @ts-ignore According to the hot-shots documentation, callback
      // is not required.
      client.close();
    }
  };
}
