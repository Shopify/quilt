export enum LogLevel {
  Info = 'info',
  Warn = 'warning',
  Critical = 'critical',
}

export type Value = string | number;

export type Data = {
  [key: string]: Value | Data;
};

export type Loggable = any;

export interface LogEntry {
  level: LogLevel;
  payload: Loggable;
}

export interface FormatableLog {
  scopes: string[];
}

export type FormatEntry = LogEntry & FormatableLog;

export interface Formatter {
  next(entry: FormatEntry): any;
}
