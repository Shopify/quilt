/* eslint-disable no-process-env */
import {Context, Request} from 'koa';
import chalk from 'chalk';
import {KoaNextFunction} from '../types';

export const LOGGER = Symbol('logger');
const PREFIX = chalk`{underline [React Server]}  `;

export class Logger {
  private buffer = '';
  private logger = console;

  log(message: string) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`${PREFIX}${message}`);
    } else {
      this.buffer = `${this.buffer}\n${message}`;
    }
  }
}

function initialRequestMessage(request: Request): string {
  const requestMethod = `${request.method.toUpperCase()} "${request.url}"`;
  return `Started ${requestMethod} for at ${new Date().toISOString()}`;
}

function endRequestMessage(ctx: Context, requestDuration: number): string {
  const httpStatus = `${ctx.status} ${ctx.message || ''}`;
  const duration = `${requestDuration.toFixed(0)}ms`;

  return `Completed ${httpStatus} at ${new Date().toISOString()} in ${duration}`;
}

function endRequest(ctx: Context, requestDuration: number) {
  ctx.state.logger.log(endRequestMessage(ctx, requestDuration));

  if (process.env.NODE_ENV === 'development') {
    return;
  }

  /* eslint-disable babel/camelcase */
  const logObject: any = {
    datetime: new Date().toISOString(),
    http_method: ctx.method.toUpperCase(),
    http_response: ctx.message || '',
    http_status: ctx.status,
    uri: ctx.originalUrl,
    user_agent: ctx.header['User-Agent'],
    payload: ctx.state.logger.buffer,
  };
  /* eslint-enable babel/camelcase */

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      logObject,
      undefined,
      process.env.NODE_ENV === 'production' ? undefined : 2,
    ),
  );
}

function requestDuration(requestStartTime: [number, number]) {
  const duration = process.hrtime(requestStartTime);
  const ms = duration[0] * 1000 + duration[1] / 1e6;
  return Math.round(ms);
}

export async function requestLogger(ctx: Context, next: KoaNextFunction) {
  const requestStartTime = process.hrtime();

  ctx.state.logger = new Logger();
  ctx.state.logger.log(initialRequestMessage(ctx.request));

  try {
    await next();
  } catch (error) {
    ctx.state.logger.log('Error during server execution, see details below.');
    ctx.state.logger.log(
      `${error.stack || error.message || 'No stack trace was present'}`,
    );
  } finally {
    endRequest(ctx, requestDuration(requestStartTime));
  }
}

export const noopLogger = {
  log: noop,
  error: noop,
};

function noop(_: any) {}
