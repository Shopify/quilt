import {Logger, LogLevel} from '..';

describe('Logger', () => {
  describe('info()', () => {
    it('passes the name as the root scope', () => {
      const rootScope = 'fred';
      const formatSpy = jest.fn(({scopes}) => {
        expect(scopes).toMatchObject([rootScope]);
      });

      const logger = new Logger({
        name: rootScope,
        formatter: {
          format: formatSpy,
        },
      });

      logger.info('hello');
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });

    it('passes Info as the log level', () => {
      const formatSpy = jest.fn(({level}) => {
        expect(level).toBe(LogLevel.Info);
      });

      const logger = new Logger({
        name: 'fred',
        formatter: {
          format: formatSpy,
        },
      });

      logger.info('hello');
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn()', () => {
    it('passes the name as the root scope', () => {
      const rootScope = 'fred';
      const formatSpy = jest.fn(({scopes}) => {
        expect(scopes).toMatchObject([rootScope]);
      });

      const logger = new Logger({
        name: rootScope,
        formatter: {
          format: formatSpy,
        },
      });

      logger.warn('hello');
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });

    it('passes Warn as the log level', () => {
      const formatSpy = jest.fn(({level}) => {
        expect(level).toBe(LogLevel.Warn);
      });

      const logger = new Logger({
        name: 'fred',
        formatter: {
          format: formatSpy,
        },
      });

      logger.warn('hello');
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('error()', () => {
    it('passes the name as the root scope', () => {
      const rootScope = 'fred';
      const formatSpy = jest.fn(({scopes}) => {
        expect(scopes).toMatchObject([rootScope]);
      });

      const logger = new Logger({
        name: rootScope,
        formatter: {
          format: formatSpy,
        },
      });

      logger.error(new Error('hello'));
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });

    it('passes Critical as the log level', () => {
      const formatSpy = jest.fn(({level}) => {
        expect(level).toBe(LogLevel.Critical);
      });

      const logger = new Logger({
        name: 'fred',
        formatter: {
          format: formatSpy,
        },
      });

      logger.error(new Error('hello'));
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });
  });
});
