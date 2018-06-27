import {LogEntry, LogLevel, Value, Formatter} from './types';
import {ConsoleFormatter} from './formatters';

export interface LoggerOptions {
  formatter?: Formatter;
  name?: string;
}

export class Logger {
  private formatter: Formatter;
  private scopes: string[];

  constructor(options?: LoggerOptions) {
    this.formatter = (options && options.formatter) || new ConsoleFormatter();
    this.scopes = options && options.name ? [options.name] : [];
  }

  warn(entry: Value) {
    this.log({level: LogLevel.Warn, payload: entry});
  }

  info(entry: Value) {
    this.log({level: LogLevel.Info, payload: entry});
  }

  error(err: Error) {
    this.log({level: LogLevel.Critical, payload: err});
  }

  private log(...entries: LogEntry[]) {
    for (const entry of entries) {
      this.formatter.format({...entry, scopes: this.scopes});
    }
  }
}
