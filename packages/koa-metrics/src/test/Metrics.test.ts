import withEnv from '@shopify/with-env';
import {StatsD} from 'hot-shots';
import Metrics from '../Metrics';

jest.mock('hot-shots');
const StatsDMock = StatsD as jest.Mock<StatsD>;

describe('Metrics', () => {
  beforeEach(() => {
    StatsDMock.mockClear();
  });

  const defaultOptions = {
    host: 'localhost',
    port: 1234,
    prefix: 'MyModule',
    globalTags: {
      aaa: 'A',
    },
  };

  it('passes the host, port, prefix, and global tags to the statsd client', () => {
    const metrics = new Metrics(defaultOptions);

    expect(StatsDMock).toHaveBeenCalledTimes(1);
    expect(StatsDMock).toHaveBeenCalledWith(defaultOptions);
  });

  describe('timing', () => {
    it('passes timing metrics to the statsd client', () => {
      const metrics = new Metrics(defaultOptions);
      metrics.timing('foo', 123, {tag: 'value'});

      const stats = StatsDMock.mock.instances[0];
      const timingFn = stats.timing;
      expect(timingFn).toHaveBeenCalledTimes(1);
      expect(timingFn).toHaveBeenCalledWith('foo', 123, {tag: 'value'});
    });

    it('logs timing metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.timing('foo', 123);

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith('timing foo:123');
      });
    });

    it('logs tags with timing metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.timing('foo', 123, {tag: 'value'});

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith('timing foo:123 #tag:value');
      });
    });

    it('does not log timing metrics to the logger in production', () => {
      withEnv('production', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.timing('foo', 123, {tag: 'value'});

        expect(logger).not.toHaveBeenCalled();
      });
    });
  });

  describe('histogram', () => {
    it('passes histogram metrics to the statsd client', () => {
      const metrics = new Metrics(defaultOptions);
      metrics.histogram('foo', 123, {tag: 'value'});

      const stats = StatsDMock.mock.instances[0];
      const histogramFn = stats.histogram;
      expect(histogramFn).toHaveBeenCalledTimes(1);
      expect(histogramFn).toHaveBeenCalledWith('foo', 123, {tag: 'value'});
    });

    it('logs histogram metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.histogram('foo', 123, {tag: 'value'});

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith('histogram foo:123 #tag:value');
      });
    });

    it('logs tags with histogram metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.histogram('foo', 123, {tag: 'value'});

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith('histogram foo:123 #tag:value');
      });
    });

    it('does not log histogram metrics to the logger in production', () => {
      withEnv('production', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.histogram('foo', 123, {tag: 'value'});

        expect(logger).not.toHaveBeenCalled();
      });
    });
  });

  describe('addGlobalTags', () => {
    it('uses the passed in global tags for future requests', () => {
      const metrics = new Metrics(defaultOptions);
      const forkedClient = new Metrics(defaultOptions);
      const childFn = StatsDMock.mock.instances[0].childClient as jest.Mock;
      childFn.mockReturnValueOnce(forkedClient);

      metrics.addGlobalTags({bbb: 'B'});

      expect(childFn).toHaveBeenCalledTimes(1);
      expect(childFn).toHaveBeenCalledWith({
        globalTags: {bbb: 'B'},
      });

      metrics.timing('foo', 123);

      expect(StatsDMock.mock.instances[0].timing).not.toHaveBeenCalled();
      expect(StatsDMock.mock.instances[1].timing).toHaveBeenCalled();
    });
  });

  describe('closeClient', () => {
    it('closes the underlying statsd client', () => {
      const metrics = new Metrics(defaultOptions);
      metrics.closeClient();

      const stats = StatsDMock.mock.instances[0];
      const closeFn = stats.close;
      expect(closeFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Timer', () => {
    it('initTimer returns a Timer whose stop method returns an integer', () => {
      const originalHrTime = process.hrtime;
      process.hrtime = () => {
        return [3, 18000000];
      };

      const metrics = new Metrics(defaultOptions);
      const timer = metrics.initTimer();
      const elapsedTime = timer.stop();

      expect(elapsedTime).toBe(3018);

      process.hrtime = originalHrTime;
    });
  });
});
