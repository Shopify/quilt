import {LogEntry, LogLevel, Value, Formatter} from './types';

export interface LoggerOptions {
  formatter: Formatter;
  name: string;
}

export class Logger {
  private formatter: Formatter;
  private scopes: string[];

  constructor(options: LoggerOptions) {
    this.formatter = options.formatter;
    this.scopes = [options.name];
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
      this.formatter.next({...entry, scopes: this.scopes});
    }
  }
}
