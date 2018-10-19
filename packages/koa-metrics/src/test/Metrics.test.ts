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

  const name = 'foo';
  const value = 123;
  const tagName = 'tag';
  const tags = {[tagName]: 'value'};

  it('passes the host, port, prefix, and global tags to the statsd client', () => {
    const metrics = new Metrics(defaultOptions);

    expect(metrics).toBeDefined();
    expect(StatsDMock).toHaveBeenCalledTimes(1);
    expect(StatsDMock).toHaveBeenCalledWith(defaultOptions);
  });

  describe('timing', () => {
    it('passes timing metrics to the statsd client', () => {
      const metrics = new Metrics(defaultOptions);
      metrics.timing(name, value, tags);

      const stats = StatsDMock.mock.instances[0];
      const timingFn = stats.timing;
      expect(timingFn).toHaveBeenCalledTimes(1);
      expect(timingFn).toHaveBeenCalledWith(name, value, tags);
    });

    it('logs timing metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.timing(name, value);

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(`timing ${name}:${value}`);
      });
    });

    it('logs tags with timing metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.timing(name, value, tags);

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(
          `timing ${name}:${value} #${tagName}:${tags[tagName]}`,
        );
      });
    });

    it('does not log timing metrics to the logger in production', () => {
      withEnv('production', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.timing(name, value, tags);

        expect(logger).not.toHaveBeenCalled();
      });
    });
  });

  describe('measure', () => {
    it('passes measure metrics to the statsd client as distribution', () => {
      const metrics = new Metrics(defaultOptions);
      metrics.measure(name, value, tags);

      const stats = StatsDMock.mock.instances[0];
      const measureFn = stats.distribution;
      expect(measureFn).toHaveBeenCalledTimes(1);
      expect(measureFn).toHaveBeenCalledWith(name, value, tags);
    });

    it('logs measure metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.measure(name, value);

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(`measure ${name}:${value}`);
      });
    });

    it('logs tags with measure metrics to the logger in development', () => {
      withEnv('development', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.measure(name, value, tags);

        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(
          `measure ${name}:${value} #${tagName}:${tags[tagName]}`,
        );
      });
    });

    it('does not log measure metrics to the logger in production', () => {
      withEnv('production', () => {
        const logger = jest.fn();
        const metrics = new Metrics(defaultOptions, logger);
        metrics.measure(name, value, tags);

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
      const supplementaryTags = {bbb: 'B'};

      metrics.addGlobalTags(supplementaryTags);

      expect(childFn).toHaveBeenCalledTimes(1);
      expect(childFn).toHaveBeenCalledWith({
        globalTags: supplementaryTags,
      });

      metrics.timing(name, value);

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
      const ms = 3018;
      process.hrtime = () => {
        return [Math.floor(ms / 1000), (ms % 1000) * 1e6];
      };

      const metrics = new Metrics(defaultOptions);
      const timer = metrics.initTimer();
      const elapsedTime = timer.stop();

      expect(elapsedTime).toBe(ms);

      process.hrtime = originalHrTime;
    });
  });
});
