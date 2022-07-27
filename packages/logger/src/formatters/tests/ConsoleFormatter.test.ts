import {ConsoleFormatter} from '../ConsoleFormatter';
import {LogLevel} from '../..';

describe('ConsoleFormatter', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('logs Critical entries to console.error', () => {
    const formatter = new ConsoleFormatter();
    const errorSpy = jest.spyOn(console, 'error');
    const errorMsg = 'foo';
    const payload = new Error(errorMsg);

    formatter.format({
      level: LogLevel.Critical,
      payload,
      scopes: [],
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const args = errorSpy.mock.calls[0];

    expect(consoleCallIncludes(args, errorMsg)).toBe(true);
    for (const stackLine of payload.stack!.split('\n')) {
      expect(consoleCallIncludes(args, stackLine)).toBe(true);
    }

    expect(consoleCallIncludes(args, LogLevel.Critical)).toBe(true);

    errorSpy.mockReset();
    errorSpy.mockRestore();
  });

  it('logs Critical entries using Error.message when Error.stack is null', () => {
    const formatter = new ConsoleFormatter();
    const errorSpy = jest.spyOn(console, 'error');
    const errorMsg = 'foo';
    const payload = new Error(errorMsg);
    payload.stack = undefined;

    formatter.format({
      level: LogLevel.Critical,
      payload,
      scopes: [],
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const args = errorSpy.mock.calls[0];

    expect(consoleCallIncludes(args, errorMsg)).toBe(true);

    errorSpy.mockReset();
    errorSpy.mockRestore();
  });

  it('logs Warn entries to console.warn', () => {
    const formatter = new ConsoleFormatter();
    const warnSpy = jest.spyOn(console, 'warn');
    const message = 'foo';

    formatter.format({
      level: LogLevel.Warn,
      payload: message,
      scopes: [],
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const args = warnSpy.mock.calls[0];

    expect(consoleCallIncludes(args, message)).toBe(true);
    expect(consoleCallIncludes(args, LogLevel.Warn)).toBe(true);

    warnSpy.mockReset();
    warnSpy.mockRestore();
  });

  it('logs Info entries to console.log', () => {
    const formatter = new ConsoleFormatter();
    const logSpy = jest.spyOn(console, 'log');
    const message = 'foo';

    formatter.format({
      level: LogLevel.Info,
      payload: message,
      scopes: [],
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const args = logSpy.mock.calls[0];

    expect(consoleCallIncludes(args, message)).toBe(true);
    expect(consoleCallIncludes(args, LogLevel.Info)).toBe(true);

    logSpy.mockReset();
    logSpy.mockRestore();
  });

  it('logs with scopes', () => {
    const formatter = new ConsoleFormatter();
    const logSpy = jest.spyOn(console, 'log');
    const message = 'foo';
    const scopes = ['a', 'b'];

    formatter.format({
      level: LogLevel.Info,
      payload: message,
      scopes,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const args = logSpy.mock.calls[0];

    expect(consoleCallIncludes(args, `[${scopes.join(':')}]`)).toBe(true);

    logSpy.mockReset();
    logSpy.mockRestore();
  });
});

function consoleCallIncludes(args: string[], str: string) {
  return args.findIndex((val) => val.includes(str)) !== -1;
}
