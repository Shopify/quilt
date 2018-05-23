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
        client.timing('request_queuing_time', timeAsInt);
      } catch (err) {
        // this is a non-critical error, so we can continue execution.
      }
    }

    try {
      await next();
    } finally {
      const responseClient = client.childClient({
        globalTags: {
          response_code: `${ctx.response.status}`,
          response_type: `${Math.floor(ctx.response.status / 100)}xx`,
        },
      });

      const duration = process.hrtime(requestStartTime);
      const [seconds, nanoseconds] = duration;
      const milliseconds = seconds * 1000 + nanoseconds / 1e6;
      responseClient.timing('request_time', Math.round(milliseconds));

      const responseContentLength: string | undefined = ctx.response.get(
        'Content-Length',
      );

      if (responseContentLength) {
        try {
          const contentLength = parseInt(responseContentLength, 10);
          responseClient.histogram('request_content_length', contentLength);
        } catch (err) {
          // this is a non-critical error, so we can continue execution.
        }
      }

      // @ts-ignore According to the hot-shots documentation, callback
      // is not required.
      client.close();
    }
  };
}

/* eslint-enable camelcase */
