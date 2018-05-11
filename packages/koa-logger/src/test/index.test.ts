import {createMockContext} from '@shopify/jest-koa-mocks';
import {createRequestLogger} from '../index';
import Logger from '../Logger';
import {withEnv} from './utilities';

jest.mock('../Logger');

beforeEach(() => {
  (Logger as any).mockClear();
});

describe('createRequestLogger', () => {
  describe('requestLogger', () => {
    it('calls the provided next function', async () => {
      const requestLogger = createRequestLogger();
      const ctx = createMockContext();
      const nextSpy = jest.fn();
      await requestLogger(ctx, nextSpy);

      expect(nextSpy).toHaveBeenCalled();
    });

    it('sets state.logger to a Logger instance', async () => {
      const requestLogger = createRequestLogger();
      const ctx = createMockContext();
      await requestLogger(ctx, () => {
        expect(ctx.state.logger).toBeInstanceOf(Logger);
      });
    });

    it('sets state.logger to a unique Logger instance per request', async () => {
      const requestLogger = createRequestLogger();

      const firstCtx = createMockContext();
      await requestLogger(firstCtx, () => {});

      const secondCtx = createMockContext();
      await requestLogger(secondCtx, () => {});

      expect(firstCtx.state.logger).not.toBe(secondCtx.state.logger);
    });

    it('sets state.logger to a unique Logger instance per request', async () => {
      const requestLogger = createRequestLogger();

      const firstCtx = createMockContext();
      await requestLogger(firstCtx, () => {});

      const secondCtx = createMockContext();
      await requestLogger(secondCtx, () => {});

      expect(firstCtx.state.logger).not.toBe(secondCtx.state.logger);
    });

    // Issue https://github.com/Shopify/quilt/issues/53
    it.skip('Logs the request URL', async () => {
      const requestLogger = createRequestLogger();
      const ctx = createMockContext({
        method: 'post',
        url: 'api.example.com',
        request: {
          ip: '192.168.0.1',
        },
        statusCode: 200,
      });
      await requestLogger(ctx, () => {});

      expect(ctx.state.logger.log).toHaveBeenCalledWith(
        'Started POST "api.example.com" for 192.168.0.1 at {DATE}',
      );
    });

    it('Logs the request status after a successful request', async () => {
      const hrtimeSpy = jest.spyOn(process, 'hrtime');
      hrtimeSpy.mockReturnValue([0, 5e6]);

      const requestLogger = createRequestLogger();
      const ctx = createMockContext({
        statusCode: 200,
      });
      await requestLogger(ctx, () => {});

      expect(ctx.state.logger.log).toHaveBeenCalledWith(
        'Completed 200 OK in 5ms',
      );

      hrtimeSpy.mockReset();
      hrtimeSpy.mockRestore();
    });

    // Issue https://github.com/Shopify/quilt/issues/52
    it.skip('Logs the redirected url after a redirected request', async () => {
      const hrtimeSpy = jest.spyOn(process, 'hrtime');
      hrtimeSpy.mockReturnValue([0, 5e6]);

      const requestLogger = createRequestLogger();
      const ctx = createMockContext({
        statusCode: 302,
      });
      await requestLogger(ctx, () => {
        ctx.redirect('example.com');
      });

      expect(ctx.state.logger.log).toHaveBeenCalledWith(
        'Completed 302 FOUND (to example.com) in 5ms',
      );

      hrtimeSpy.mockReset();
      hrtimeSpy.mockRestore();
    });

    // Issue https://github.com/Shopify/quilt/issues/53
    // Issue https://github.com/Shopify/quilt/issues/55
    it.skip('Adds context to the logger after a successful request in production', () => {
      withEnv('production', async () => {
        const hrtimeSpy = jest.spyOn(process, 'hrtime');
        hrtimeSpy.mockReturnValue([0, 5e6]);

        const mockDatetime = new Date().toISOString();
        const dateSpy = jest.spyOn(Date.prototype, 'toISOString');
        dateSpy.mockReturnValue(mockDatetime);

        const requestLogger = createRequestLogger();
        const ctx = createMockContext({
          method: 'get',
          statusCode: 200,
          url: 'example.com',
          headers: {
            'User-Agent': 'some-ua-string',
          },
          request: {
            ip: '192.168.0.1',
          },
        });
        await requestLogger(ctx, () => {});

        /* eslint-disable camelcase */
        expect(ctx.state.logger.addContext).toHaveBeenCalledWith({
          datetime: mockDatetime,
          http_method: 'GET',
          http_response: 'OK',
          http_status: 200,
          ip: '192.168.0.1',
          // eslint-disable-next-line no-undefined
          referer: undefined,
          response_time: '5ms',
          uri: 'example.com',
          user_agent: 'some-ua-string',
        });
        /* eslint-enable camelcase */

        hrtimeSpy.mockReset();
        hrtimeSpy.mockRestore();
        dateSpy.mockReset();
        dateSpy.mockRestore();
      });
    });

    it('Does not add context to the logger after a successful request in development', () => {
      withEnv('development', async () => {
        const requestLogger = createRequestLogger();
        const ctx = createMockContext();
        await requestLogger(ctx, () => {});

        expect(ctx.state.logger.addContext).not.toHaveBeenCalled();
      });
    });

    it('Flushes the logger after a successful request in production', () => {
      withEnv('production', async () => {
        const requestLogger = createRequestLogger();
        const ctx = createMockContext();
        await requestLogger(ctx, () => {});

        expect(ctx.state.logger.flush).toHaveBeenCalledTimes(1);
      });
    });

    it('Does not flush the logger after a successful request in development', () => {
      withEnv('development', async () => {
        const requestLogger = createRequestLogger();
        const ctx = createMockContext();
        await requestLogger(ctx, () => {});

        expect(ctx.state.logger.flush).not.toHaveBeenCalled();
      });
    });
  });

  describe('onLoggerFlush', () => {
    it('is called in production before logger.flush', () => {
      withEnv('production', async () => {
        const ctx = createMockContext();
        const flushSpy = jest.fn(context => {
          expect(context).toBe(ctx);
          expect(ctx.state.logger.flush).not.toHaveBeenCalled();
        });
        const requestLogger = createRequestLogger(flushSpy);
        await requestLogger(ctx, () => {});

        expect(flushSpy).toHaveBeenCalledTimes(1);
        expect(ctx.state.logger.flush).toHaveBeenCalledTimes(1);
      });
    });

    it('is not called in development', () => {
      withEnv('development', async () => {
        const ctx = createMockContext();
        const flushSpy = jest.fn();
        const requestLogger = createRequestLogger(flushSpy);
        await requestLogger(ctx, () => {});

        expect(flushSpy).not.toHaveBeenCalled();
      });
    });
  });
});
