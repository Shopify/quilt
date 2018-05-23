import {StatsD} from 'hot-shots';
import {Context} from 'koa';

export function instrumentContentLength(client: StatsD, ctx: Context) {
  const responseContentLength: string | undefined = ctx.response.get(
    'Content-Length',
  );

  if (responseContentLength) {
    try {
      const contentLength = parseInt(responseContentLength, 10);
      client.histogram('request_content_length', contentLength);
    } catch (err) {
      // this is a non-critical error, so we can continue execution.
    }
  }
}
