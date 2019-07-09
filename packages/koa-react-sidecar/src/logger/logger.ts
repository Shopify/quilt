import {Context} from 'koa';
import chalk from 'chalk';
import {KoaNextFunction} from '../types';

const LOGGER = Symbol('logger');
const PREFIX = chalk`{underline sidecar} ⁓ `;

export class Logger {
  private logger: Logger;

  constructor(logger?) {
    this.logger = logger || console;
  }

  log(message) {
    this.logger.log(`${PREFIX}${message}`);
  }

  error(message) {
    this.logger.error(`${PREFIX}${message}`);
  }
}

export function getLogger(ctx: Context): Logger {
  return ctx.state[LOGGER];
}

export function setLogger(ctx: Context, logger: Logger) {
  ctx.state[LOGGER] = logger;
}

export function createLogger(userLogger?: Logger) {
  const logger = userLogger || new Logger();

  return async function loggerMiddleware(ctx: Context, next: KoaNextFunction) {
    setLogger(ctx, logger);

    await next();
  };
}
