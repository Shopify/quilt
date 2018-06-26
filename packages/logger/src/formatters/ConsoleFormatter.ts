import chalk from 'chalk';
import {info, warning, error} from 'log-symbols';
import prettyMs from 'pretty-ms';

import {LogLevel, FormatEntry, Formatter} from '../types';

export class ConsoleFormatter implements Formatter {
  private startTime: [number, number];

  constructor() {
    this.startTime = process.hrtime();
  }

  next(entry: FormatEntry) {
    const timeDiff = process.hrtime(this.startTime);
    const msDiff = timeDiff[0] * 1000 + timeDiff[1] / 1000;
    const timestamp = chalk.magenta(`+${prettyMs(msDiff)}`);

    const {level, payload, scopes} = entry;

    let logMsg = `${payload} ${timestamp}`;

    if (level === LogLevel.Critical) {
      const {message, stack} = payload as Error;
      logMsg = message;

      if (stack != null) {
        const [name, ...lines] = stack.split('\n');
        logMsg = `${name} ${timestamp}\n${lines
          .map(line => {
            return chalk.gray(line);
          })
          .join('\n')}`;
      }
    }

    const prefix = `[${scopes.join(':')}] `;
    const {logFn, icon, chalkColor} = configForLogLevel(level);
    logFn(
      prefix,
      icon,
      spaces(1),
      chalkColor.bold.underline(level),
      spaces(8 - level.length),
      logMsg,
    );
  }
}

function spaces(num: number) {
  return (spaces as any).memoize[num] || new Array(num).fill(' ').join('');
}
(spaces as any).memoize = {};

function configForLogLevel(logLevel: LogLevel) {
  if (logLevel === LogLevel.Warn) {
    return {
      // eslint-disable-next-line no-console
      logFn: console.warn,
      icon: warning,
      chalkColor: chalk.yellow,
    };
  } else if (logLevel === LogLevel.Critical) {
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
