import chalk from 'chalk';
import {info, warning, error} from 'log-symbols';
import prettyMs from 'pretty-ms';

import {LogLevel, FormatEntry, Formatter} from '../types';

const MAX_LEVEL_LENGTH = [LogLevel.Critical, LogLevel.Info, LogLevel.Warn]
  .map(level => level.length)
  .reduce((lenA, lenB) => (lenA > lenB ? lenA : lenB));

export class ConsoleFormatter implements Formatter {
  private startTime: [number, number];

  constructor() {
    this.startTime = process.hrtime();
  }

  private get timestamp() {
    const duration = process.hrtime(this.startTime);
    const [seconds, nanoseconds] = duration;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    return prettyMs(milliseconds);
  }

  format(entry: FormatEntry) {
    const timestamp = chalk.magenta(`+${this.timestamp}`);

    const {level, payload, scopes} = entry;

    let logMsg = '';

    if (level === LogLevel.Critical) {
      const {message, stack} = payload as Error;
      logMsg = `${message} ${timestamp}`;

      if (stack != null) {
        const [messageLine, ...otherLines] = stack.split('\n');
        logMsg = `${messageLine} ${timestamp}\n${otherLines
          .map(line => {
            return chalk.gray(line);
          })
          .join('\n')}`;
      }
    } else {
      logMsg = `${payload} ${timestamp}`;
    }

    const prefix = scopes.length ? `[${scopes.join(':')}] ` : '';
    const {logFn, icon, chalkColor} = configForLogLevel(level);
    logFn(
      prefix,
      icon,
      ' ',
      chalkColor.bold.underline(level),
      ' '.repeat(MAX_LEVEL_LENGTH - level.length),
      logMsg,
    );
  }
}

function configForLogLevel(logLevel: LogLevel) {
  if (logLevel === LogLevel.Warn) {
    return {
      // eslint-disable-next-line no-console
      logFn: console.warn,
      icon: warning,
      chalkColor: chalk.yellow,
    };
  }
  if (logLevel === LogLevel.Critical) {
    return {
      // eslint-disable-next-line no-console
      logFn: console.error,
      icon: error,
      chalkColor: chalk.red,
    };
  }
  return {
    // eslint-disable-next-line no-console
    logFn: console.log,
    icon: info,
    chalkColor: chalk.blue,
  };
}
