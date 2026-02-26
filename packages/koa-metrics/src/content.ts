import {Context} from 'koa';

export function getContentLength(ctx: Context): number | null {
  const responseContentLength: string | undefined = ctx.response.get(
    'Content-Length',
  );

  if (responseContentLength) {
    try {
      return parseInt(responseContentLength, 10);
    } catch (err) {
      // this is a non-critical error, so we can continue execution.
    }
  }

  return null;
}
