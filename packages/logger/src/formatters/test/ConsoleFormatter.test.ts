import {ConsoleFormatter} from '../ConsoleFormatter';
import {LogLevel} from '../..';

describe('ConsoleFormatter', () => {
  it('logs Critical entries to console.error', () => {
    const formatter = new ConsoleFormatter();
    const errorSpy = jest.spyOn(console, 'error');
    const errorMsg = 'foo';

    formatter.next({
      level: LogLevel.Critical,
      payload: new Error(errorMsg),
      scopes: [],
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const args = errorSpy.mock.calls[0];

    expect(consoleCallInludes(args, errorMsg)).toBe(true);
    expect(consoleCallInludes(args, LogLevel.Critical)).toBe(true);

    errorSpy.mockReset();
    errorSpy.mockRestore();
  });

  it('logs Critical entries using Error.message when Error.stack is null', () => {
    const formatter = new ConsoleFormatter();
    const errorSpy = jest.spyOn(console, 'error');
    const errorMsg = 'foo';
    const payload = new Error(errorMsg);
    payload.stack = null;

    formatter.next({
      level: LogLevel.Critical,
      payload,
      scopes: [],
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const args = errorSpy.mock.calls[0];

    expect(consoleCallInludes(args, errorMsg)).toBe(true);

    errorSpy.mockReset();
    errorSpy.mockRestore();
  });

  it('logs Warn entries to console.warn', () => {
    const formatter = new ConsoleFormatter();
    const warnSpy = jest.spyOn(console, 'warn');
    const message = 'foo';

    formatter.next({
      level: LogLevel.Warn,
      payload: message,
      scopes: [],
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const args = warnSpy.mock.calls[0];

    expect(consoleCallInludes(args, message)).toBe(true);
    expect(consoleCallInludes(args, LogLevel.Warn)).toBe(true);

    warnSpy.mockReset();
    warnSpy.mockRestore();
  });

  it('logs Info entries to console.log', () => {
    const formatter = new ConsoleFormatter();
    const logSpy = jest.spyOn(console, 'log');
    const message = 'foo';

    formatter.next({
      level: LogLevel.Info,
      payload: message,
      scopes: [],
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const args = logSpy.mock.calls[0];

    expect(consoleCallInludes(args, message)).toBe(true);
    expect(consoleCallInludes(args, LogLevel.Info)).toBe(true);

    logSpy.mockReset();
    logSpy.mockRestore();
  });

  it('logs with scopes', () => {
    const formatter = new ConsoleFormatter();
    const logSpy = jest.spyOn(console, 'log');
    const message = 'foo';
    const scopes = ['a', 'b'];

    formatter.next({
      level: LogLevel.Info,
      payload: message,
      scopes,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const args = logSpy.mock.calls[0];

    expect(consoleCallInludes(args, `[${scopes.join(':')}]`)).toBe(true);

    logSpy.mockReset();
    logSpy.mockRestore();
  });
});

function consoleCallInludes(args: string[], str: string) {
  return args.findIndex(val => val.includes(str)) !== -1;
}
