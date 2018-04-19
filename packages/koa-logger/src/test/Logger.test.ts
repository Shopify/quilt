import Logger from '../Logger';
import {withEnv} from './utilities';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-v4',
}));

describe('Logger', () => {
  describe('development', () => {
    it('logs to console.log when log is called', () => {
      withEnv('development', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const logger = new Logger();
        logger.log('this is a test');
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);

        const logMessage = consoleLogSpy.mock.calls[0][0];
        expect(logMessage).toBe('[request id=mock-uuid-v4] this is a test');

        consoleLogSpy.mockReset();
        consoleLogSpy.mockRestore();
      });
    });
  });

  describe('production', () => {
    it('does not log to console.log when log is called', () => {
      withEnv('production', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const logger = new Logger();
        logger.log('this is a test');
        expect(consoleLogSpy).not.toHaveBeenCalled();

        consoleLogSpy.mockReset();
        consoleLogSpy.mockRestore();
      });
    });

    it('logs to "payload" and "request_id" via console.log when flush is called', () => {
      withEnv('production', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const logger = new Logger();
        logger.log('this is a test');
        logger.log('this is also a test');
        logger.flush();
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);

        const logMessage = consoleLogSpy.mock.calls[0][0];
        expect(logMessage).toBe(
          JSON.stringify({
            payload: 'this is a test\nthis is also a test',
            // eslint-disable-next-line camelcase
            request_id: 'mock-uuid-v4',
          }),
        );

        consoleLogSpy.mockReset();
        consoleLogSpy.mockRestore();
      });
    });

    it('adds custom context to console.log when flush is called', () => {
      withEnv('production', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const logger = new Logger();
        logger.log('this is a test');
        logger.addContext({
          foo: 'foo',
        });
        logger.flush();
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);

        const logMessage = consoleLogSpy.mock.calls[0][0];
        expect(logMessage).toBe(
          JSON.stringify({
            foo: 'foo',
            payload: 'this is a test',
            // eslint-disable-next-line camelcase
            request_id: 'mock-uuid-v4',
          }),
        );

        consoleLogSpy.mockReset();
        consoleLogSpy.mockRestore();
      });
    });

    it('adds custom context with prefixes to console.log when flush is called', () => {
      withEnv('production', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');

        const logger = new Logger();
        logger.log('this is a test');
        logger.addContext(
          {
            foo: 'foo',
          },
          'bar',
        );
        logger.flush();
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);

        const logMessage = consoleLogSpy.mock.calls[0][0];
        expect(logMessage).toBe(
          JSON.stringify({
            // eslint-disable-next-line camelcase
            bar_foo: 'foo',
            payload: 'this is a test',
            // eslint-disable-next-line camelcase
            request_id: 'mock-uuid-v4',
          }),
        );

        consoleLogSpy.mockReset();
        consoleLogSpy.mockRestore();
      });
    });
  });
});
