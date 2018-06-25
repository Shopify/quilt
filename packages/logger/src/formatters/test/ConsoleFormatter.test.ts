import {ConsoleFormatter} from '../ConsoleFormatter';
import {LogLevel} from '../..';

jest.mock('youch');
jest.mock('youch-terminal');

describe('ConsoleFormatter', () => {
  it('logs errors using Youch', async () => {
    const formatter = new ConsoleFormatter();

    formatter.next({
      level: LogLevel.Critical,
      payload: new Error('foo'),
      scopes: [],
    });
  });
});
