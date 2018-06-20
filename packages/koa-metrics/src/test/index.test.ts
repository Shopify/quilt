import {createMockContext} from '@shopify/jest-koa-mocks';
import metrics, {CustomMetrics} from '..';
import Metrics from '../Metrics';
import {Tags} from '../tags';

jest.mock('../Metrics');
const MetricsMock = (Metrics as any) as jest.Mock<Metrics>;

const defaultOptions = {
  prefix: 'TestModule',
  host: 'localhost:1234',
};

describe('koa-metrics', () => {
  beforeEach(() => {
    MetricsMock.mockClear();
  });

  it('provides a Metrics client as ctx.metrics', async () => {
    const metricsMiddleware = metrics(defaultOptions);

    const ctx = createMockContext();

    await metricsMiddleware(ctx, () => {
      expect(ctx.metrics).toBeInstanceOf(Metrics);
    });

    expect(Metrics).toHaveBeenCalledTimes(1);
  });

  it('uses the provided prefix for metrics metrics', async () => {
    const metricsMiddleware = metrics(defaultOptions);

    const ctx = createMockContext();

    await metricsMiddleware(ctx, () => {});
    expect(MetricsMock.mock.calls[0][0]).toMatchObject({
      prefix: 'TestModule',
    });
  });

  it('uses the provided host for the metrics client', async () => {
    const metricsMiddleware = metrics(defaultOptions);

    const ctx = createMockContext();

    await metricsMiddleware(ctx, () => {});
    expect(MetricsMock.mock.calls[0][0]).toMatchObject({
      host: 'localhost',
      port: 1234,
    });
  });

  it('closes the metrics client', async () => {
    const metricsMiddleware = metrics(defaultOptions);

    const ctx = createMockContext();

    await metricsMiddleware(ctx, () => {});

    expect(MetricsMock.mock.instances[0].closeClient).toHaveBeenCalled();
  });

  describe('tags', () => {
    it('tags the initial metrics client with the path', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext({
        url: '/some/path/',
      });

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][0]).toMatchObject({
        globalTags: {
          [Tags.Path]: '/some/path/',
        },
      });
    });

    it('tags the initial metrics client with the request method', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][0]).toMatchObject({
        globalTags: {
          [Tags.RequestMethod]: 'GET',
        },
      });
    });

    it('tags the metrics client with the response code', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {
        ctx.response.status = 418;
      });
      const addTagsFn = MetricsMock.mock.instances[0]
        .addGlobalTags as jest.Mock<Metrics['addGlobalTags']>;
      const addedTags = addTagsFn.mock.calls.reduce(
        (acc, call) => Object.assign({}, acc, call[0]),
        {},
      );
      expect(addedTags).toMatchObject({
        [Tags.ResponseCode]: '418',
      });
    });

    it('tags the metrics client with the response type', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {
        ctx.response.status = 418;
      });
      const addTagsFn = MetricsMock.mock.instances[0]
        .addGlobalTags as jest.Mock<Metrics['addGlobalTags']>;
      const addedTags = addTagsFn.mock.calls.reduce(
        (acc, call) => Object.assign({}, acc, call[0]),
        {},
      );
      expect(addedTags).toMatchObject({
        [Tags.ResponseType]: '4xx',
      });
    });
  });

  describe('logging', () => {
    it('uses the provided logger for the metrics client', async () => {
      function logger() {}
      const metricsMiddleware = metrics({...defaultOptions, logger});

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][1]).toBe(logger);
    });

    it('uses ctx.log for the metrics client if available and no logger was provided', async () => {
      function logger() {}
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();
      ctx.log = logger;

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][1]).toBe(logger);
    });

    it('uses console.log for the metrics client if no logger was provided and ctx.log is undefined', async () => {
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});
      // eslint-disable-next-line no-console
      expect(MetricsMock.mock.calls[0][1]).toBe(console.log);
    });
  });

  describe('request_queuing_time', () => {
    it('logs the queuing time based on the X-Request-Start header before calling next', async () => {
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext({
        headers: {
          'X-Request-Start': '100',
        },
      });

      await metricsMiddleware(ctx, () => {
        expect(MetricsMock.mock.instances[0].timing).toHaveBeenCalledWith(
          CustomMetrics.QueuingTime,
          100,
        );
      });
    });

    it('does not log the queuing time when the X-Request-Start header is not present', async () => {
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {
        const timingFn = MetricsMock.mock.instances[0].timing as jest.Mock<
          Metrics['timing']
        >;
        expect(
          timingFn.mock.calls.map(([metricName]) => metricName),
        ).not.toContain(CustomMetrics.QueuingTime);
      });
    });
  });

  describe('request_time', () => {
    it('logs the request time', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      MetricsMock.prototype.initTimer = () => {
        return {
          stop() {
            return 123;
          },
        };
      };

      await metricsMiddleware(ctx, () => {
        const timingFn = MetricsMock.mock.instances[0].initTimer as jest.Mock;
        timingFn.mockReturnValueOnce({stop: () => 123});
      });

      expect(MetricsMock.mock.instances[0].timing).toHaveBeenCalledWith(
        CustomMetrics.RequestDuration,
        123,
      );
    });
  });

  describe('request_content_length', () => {
    it('logs the request content length based on the Content-Length header', async () => {
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {
        ctx.response.length = 7500;
        const originalGet = ctx.response.get;
        ctx.response.get = headerName => {
          if (headerName === 'Content-Length') {
            return '7500';
          }
          return originalGet(headerName);
        };
      });

      expect(MetricsMock.mock.instances[0].measure).toHaveBeenCalledWith(
        CustomMetrics.ContentLength,
        7500,
      );
    });

    it('does not logs the request content length when the Content-Length header is not present', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});

      const measureFn = MetricsMock.mock.instances[0].measure as jest.Mock<
        Metrics['measure']
      >;

      expect(
        measureFn.mock.calls.map(([metricName]) => metricName),
      ).not.toContain(CustomMetrics.ContentLength);
    });
  });

  describe('skipInstrumentation', () => {
    it('does not log metrics when skipInstrumentation is true', async () => {
      const metricsMiddleware = metrics({
        ...defaultOptions,
        skipInstrumentation: true,
      });
      const ctx = createMockContext({
        headers: {
          'X-Request-Start': '100',
        },
      });

      MetricsMock.prototype.initTimer = () => {
        return {
          stop() {
            return 123;
          },
        };
      };

      await metricsMiddleware(ctx, () => {
        const timingFn = MetricsMock.mock.instances[0].initTimer as jest.Mock;
        timingFn.mockReturnValueOnce({stop: () => 123});
        ctx.response.length = 7500;
        const originalGet = ctx.response.get;
        ctx.response.get = headerName => {
          if (headerName === 'Content-Length') {
            return '7500';
          }
          return originalGet(headerName);
        };
      });

      expect(MetricsMock.mock.instances[0].timing).not.toHaveBeenCalled();
      expect(MetricsMock.mock.instances[0].measure).not.toHaveBeenCalled();
    });
  });
});
