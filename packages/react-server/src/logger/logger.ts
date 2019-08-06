import {Context} from 'koa';
import chalk from 'chalk';
import {KoaNextFunction} from '../types';

const LOGGER = Symbol('logger');
const PREFIX = chalk`{underline sidecar} ⁓ `;

interface LoggerOptions {
  level?: Verbosity;
}

export enum Verbosity {
  Off,
  Debug,
}

export class Logger {
  private logger: Pick<Console, 'log' | 'error'> =
    this.options.level === Verbosity.Off ? noopLogger : console;

  constructor(private options: LoggerOptions = {level: Verbosity.Off}) {}

  log(message: string) {
    this.logger.log(`${PREFIX}${message}`);
  }

  error(message: string) {
    this.logger.error(`${PREFIX}${message}`);
  }
}

export function getLogger(ctx: Context): Logger {
  return ctx.state[LOGGER];
}

export function setLogger(ctx: Context, logger: Logger) {
  ctx.state[LOGGER] = logger;
}

export function createLogger(options?: LoggerOptions) {
  const logger = new Logger(options);

  return async function loggerMiddleware(ctx: Context, next: KoaNextFunction) {
    setLogger(ctx, logger);

    await next();
  };
}

const noopLogger = {
  log: noop,
  error: noop,
};

function noop(_: any) {}
