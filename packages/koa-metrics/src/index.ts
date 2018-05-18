/* eslint-disable camelcase */
import {StatsD} from 'hot-shots';
import {Context} from 'koa';

export interface Options {
  prefix: string;
  host: string;
}

export default function metrics({prefix, host}: Options) {
  const statsdHost = host.split(':')[0];
  const statsdPort = parseInt(host.split(':')[1], 10);

  return async function statsdMiddleware(ctx: Context, next: Function) {
    const requestStartTime = process.hrtime();
    // @ts-ignore the types here are correct. TS complains about method
    // potentially being undefined, but in reality, this is fine (see docs).
    const client = new StatsD({
      host: statsdHost,
      port: statsdPort,
      prefix,
      globalTags: {
        path: ctx.path,
        request_method: ctx.request.method,
      },
    });

    // allow later middleware to add metrics
    ctx.state.statsd = client;

    const requestQueuingTime = ctx.request.get('X-Request-Start');
    if (requestQueuingTime) {
      try {
        const timeAsInt = parseInt(requestQueuingTime, 10);
        // @ts-ignore see description of tags in the hot-shots documentation
        client.timing('request_queuing_time', timeAsInt, {});
      } catch (err) {
        // ignore errors here
      }
    }

    try {
      await next();
    } finally {
      const responseClient = client.childClient({
        globalTags: {
          response_code: `${ctx.response.status}`,
          // example: 2xx, 3xx, ...
          response_type: `${Math.floor(ctx.response.status / 100)}xx`,
        },
      });

      const duration = process.hrtime(requestStartTime);
      const ms = duration[0] * 1000 + duration[1] / 1e6;
      responseClient.timing('request_time', Math.round(ms));

      responseClient.histogram('request_content_length', ctx.response.length);

      // @ts-ignore According to the hot-shots documentation, callback
      // is not required.
      client.close();
    }
  };
}

/* eslint-enable camelcase */
