import {createMockContext} from '@shopify/jest-koa-mocks';
import {StatsDClient} from '@shopify/statsd';
import {Tag} from '../tags';
import metrics, {CustomMetric} from '../middleware';

jest.mock('@shopify/statsd');
const MetricsMock = StatsDClient as jest.Mock<StatsDClient>;

const defaultHost = 'localhost';
const defaultPort = 1234;
const defaultOptions = {
  prefix: 'TestModule',
  host: `${defaultHost}:${defaultPort}`,
};

describe('koa-metrics', () => {
  beforeEach(() => {
    MetricsMock.mockClear();
  });

  it('provides a Metrics client as ctx.metrics', async () => {
    const metricsMiddleware = metrics(defaultOptions);

    const ctx = createMockContext();

    await metricsMiddleware(ctx, () => {
      expect(ctx.metrics).toBeInstanceOf(StatsDClient);
    });

    expect(MetricsMock).toHaveBeenCalledTimes(1);
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
      host: defaultHost,
      port: defaultPort,
    });
  });

  it('closes the metrics client', async () => {
    const metricsMiddleware = metrics(defaultOptions);

    const ctx = createMockContext();

    await metricsMiddleware(ctx, () => {});

    expect(MetricsMock.mock.instances[0].close).toHaveBeenCalled();
  });

  describe('tags', () => {
    it('tags the initial metrics client with the path', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const path = '/some/path/';
      const ctx = createMockContext({
        url: path,
      });

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][0]).toMatchObject({
        globalTags: {
          [Tag.Path]: path,
        },
      });
    });

    it('tags the initial metrics client with the request method', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][0]).toMatchObject({
        globalTags: {
          [Tag.RequestMethod]: 'GET',
        },
      });
    });

    it('tags the metrics client with the response code', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();
      const status = 418;

      await metricsMiddleware(ctx, () => {
        ctx.response.status = status;
      });
      const addTagsFn = MetricsMock.mock.instances[0]
        .addGlobalTags as jest.Mock<StatsDClient['addGlobalTags']>;
      const addedTags = addTagsFn.mock.calls.reduce(
        (acc, call) => ({...acc, ...call[0]}),
        {},
      );
      expect(addedTags).toMatchObject({
        [Tag.ResponseCode]: String(status),
      });
    });

    it('tags the metrics client with the response type', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();
      const status = 418;
      const responseType = `${Math.floor(status / 100)}xx`;

      await metricsMiddleware(ctx, () => {
        ctx.response.status = status;
      });
      const addTagsFn = MetricsMock.mock.instances[0]
        .addGlobalTags as jest.Mock<StatsDClient['addGlobalTags']>;
      const addedTags = addTagsFn.mock.calls.reduce(
        (acc, call) => ({...acc, ...call[0]}),
        {},
      );
      expect(addedTags).toMatchObject({
        [Tag.ResponseType]: responseType,
      });
    });
  });

  describe('logging', () => {
    it('uses the provided logger for the metrics client', async () => {
      function logger() {}
      logger.log = () => {};
      const metricsMiddleware = metrics({...defaultOptions, logger});

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][0].logger).toBe(logger);
    });

    it('uses ctx.log for the metrics client if available and no logger was provided', async () => {
      function logger() {}
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();
      ctx.log = logger;

      await metricsMiddleware(ctx, () => {});
      expect(MetricsMock.mock.calls[0][0].logger).toBe(logger);
    });

    it('uses console.log for the metrics client if no logger was provided and ctx.log is undefined', async () => {
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});
      // eslint-disable-next-line no-console
      expect(MetricsMock.mock.calls[0][0].logger).toBe(console.log);
    });
  });

  describe('request_queuing_time', () => {
    it('logs the queuing time based on the X-Request-Start header before calling next', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const queuingTime = 100;

      const ctx = createMockContext({
        headers: {
          'X-Request-Start': String(queuingTime),
        },
      });

      await metricsMiddleware(ctx, () => {
        expect(MetricsMock.mock.instances[0].distribution).toHaveBeenCalledWith(
          CustomMetric.QueuingTime,
          queuingTime,
        );
      });
    });

    it('does not log the queuing time when the X-Request-Start header is not present', async () => {
      const metricsMiddleware = metrics(defaultOptions);

      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {
        const distributionFn = MetricsMock.mock.instances[0]
          .distribution as jest.Mock;
        expect(
          distributionFn.mock.calls.map(([metricName]) => metricName),
        ).not.toContain(CustomMetric.QueuingTime);
      });
    });
  });

  describe('request_time', () => {
    it('logs the request time', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});

      expect(MetricsMock.mock.instances[0].distribution).toHaveBeenCalledWith(
        CustomMetric.RequestDuration,
        expect.any(Number),
      );
    });
  });

  describe('request_content_length', () => {
    it('logs the request content length based on the Content-Length header', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();
      const length = 7500;

      await metricsMiddleware(ctx, () => {
        ctx.response.length = length;
        const originalGet = ctx.response.get;
        ctx.response.get = headerName => {
          if (headerName === 'Content-Length') {
            return String(length);
          }
          return originalGet(headerName);
        };
      });

      expect(MetricsMock.mock.instances[0].distribution).toHaveBeenCalledWith(
        CustomMetric.ContentLength,
        length,
      );
    });

    it('does not logs the request content length when the Content-Length header is not present', async () => {
      const metricsMiddleware = metrics(defaultOptions);
      const ctx = createMockContext();

      await metricsMiddleware(ctx, () => {});

      const distributionFn = MetricsMock.mock.instances[0]
        .distribution as jest.Mock;

      expect(
        distributionFn.mock.calls.map(([metricName]) => metricName),
      ).not.toContain(CustomMetric.ContentLength);
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

      expect(MetricsMock.mock.instances[0].distribution).not.toHaveBeenCalled();
    });
  });
});
