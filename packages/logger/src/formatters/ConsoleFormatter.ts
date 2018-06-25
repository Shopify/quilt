import chalk from 'chalk';
import {info, warning} from 'log-symbols';
import prettyMs from 'pretty-ms';
import Youch from 'youch';
import forTerminal from 'youch-terminal';

import {LogLevel, FormatEntry, Formatter} from '../types';

export class ConsoleFormatter implements Formatter {
  private startTime: [number, number];

  constructor() {
    this.startTime = process.hrtime();
  }

  next(entry: FormatEntry) {
    const {level, payload, scopes} = entry;

    if (level === LogLevel.Critical) {
      // eslint-disable-next-line promise/catch-or-return
      new Youch(payload)
        .toJSON()
        // eslint-disable-next-line promise/always-return
        .then(err => {
          // eslint-disable-next-line no-console
          console.error(forTerminal(err));
        });
      return;
    }

    const timeDiff = process.hrtime(this.startTime);
    const msDiff = timeDiff[0] * 1000 + timeDiff[1] / 1000;
    const prefix = chalk.gray(`[${scopes.join(':')}] - `);
    const suffix = chalk.gray(` +${prettyMs(msDiff)}`);
    const {logFn, icon, chalkColor} = configForLogLevel(level);
    logFn(
      prefix,
      icon,
      spaces(1),
      chalkColor.bold.underline(level),
      spaces(8 - level.length + 2),
      payload,
      suffix,
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
  }
  return {
    // eslint-disable-next-line no-console
    logFn: console.log,
    icon: info,
    chalkColor: chalk.blue,
  };
}
