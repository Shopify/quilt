import {Context, Request} from 'koa';
import Logger from './Logger';

type RequestWithBody = Request & {body?: Object};

function initialRequestMessage(request: Request): string {
  return `Started ${request.method.toUpperCase()} "${
    request.originalUrl
  }" for ${request.ip} at ${new Date().toISOString()}`;
}

function endRequestMessage(ctx: Context, requestDuration: string): string {
  const redirectMessage =
    ctx.status === 302 || ctx.status === 303
      ? ` (to ${ctx.response.headers.location})`
      : '';
  return `Completed ${ctx.status} ${ctx.message ||
    ''}${redirectMessage} in ${requestDuration}ms`;
}

function endRequest(
  ctx: Context,
  requestDuration: string,
  onLoggerFlush?: (ctx: Context) => void,
) {
  ctx.state.logger.log(endRequestMessage(ctx, requestDuration));

  if (process.env.NODE_ENV === 'production') {
    /* eslint-disable camelcase */
    const requestContext: any = {
      datetime: new Date().toISOString(),
      http_method: ctx.method.toUpperCase(),
      http_response: ctx.message || '',
      http_status: ctx.status,
      ip: ctx.request.ip,
      referer: ctx.header.Referer,
      response_time: `${requestDuration}ms`,
      uri: ctx.originalUrl,
      user_agent: ctx.header['User-Agent'],
    };
    /* eslint-enable camelcase */

    ctx.state.logger.addContext(requestContext);

    const requestParams = {
      ...(ctx.request as RequestWithBody).body,
      ...ctx.query,
    };

    ctx.state.logger.addContext(requestParams, 'param');
    ctx.state.logger.addContext(ctx.header, 'http_header');

    if (onLoggerFlush != null) {
      onLoggerFlush(ctx);
    }

    ctx.state.logger.flush();
  }
}

function requestDuration(requestStartTime: [number, number]) {
  const duration = process.hrtime(requestStartTime);
  const ms = duration[0] * 1000 + duration[1] / 1e6;
  return ms.toFixed(0);
}

export function createRequestLogger(onLoggerFlush?: (ctx: Context) => void) {
  return async function requestLogger(ctx: Context, next: Function) {
    const requestStartTime = process.hrtime();
    ctx.state.logger = new Logger();

    ctx.state.logger.log(initialRequestMessage(ctx.request));
    try {
      await next();
    } catch (error) {
      ctx.state.logger.log(
        `${error.stack || 'Error occured, but no stack trace was present'}`,
      );
    } finally {
      endRequest(ctx, requestDuration(requestStartTime), onLoggerFlush);
    }
  };
}

// This logger is specifically for handling non-request related errors (Primarily during startup).
// All request errors will be caught by requestLogger() method above
export function errorLogger(error: Error) {
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(error));
  } else {
    // eslint-disable-next-line no-console
    console.log(
      `${error.stack || 'Error occured, but no stack trace was present'}`,
    );
  }
}
