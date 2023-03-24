import {StatsD} from 'hot-shots';

import {StatsDClient} from '../client';

jest.mock('hot-shots');
const StatsDMock = StatsD as jest.Mock;

describe('StatsDClient', () => {
  beforeEach(() => {
    StatsDMock.mockClear();
  });

  const defaultOptions = {
    host: 'localhost',
    port: 1234,
    prefix: 'MyPrefix',
    suffix: 'MySuffix',
    globalTags: {
      aaa: 'A',
    },
  };

  const stat = 'stat name';
  const value = 123;
  const tagName = 'fooBar';
  const tagValue = 'camelCasedFooBar';
  const tags = {[tagName]: tagValue};
  const sampleRate = 0.5;

  it('passes all the options to the statsd client', () => {
    const statsDClient = new StatsDClient(defaultOptions);

    expect(statsDClient).toBeDefined();
    expect(StatsDMock).toHaveBeenCalledTimes(1);
    expect(StatsDMock).toHaveBeenCalledWith({
      ...defaultOptions,
      errorHandler: expect.any(Function),
    });
  });

  describe('distribution', () => {
    it('passes distribution metrics to the statsd client', () => {
      const statsDClient = new StatsDClient(defaultOptions);
      statsDClient.distribution(stat, value, tags, {sampleRate});

      const stats = StatsDMock.mock.instances[0];
      const distributionFn = stats.distribution;
      expect(distributionFn).toHaveBeenCalledTimes(1);
      expect(distributionFn).toHaveBeenCalledWith(
        stat,
        value,
        sampleRate,
        tags,
        expect.any(Function),
      );
    });

    it('passes distribution metrics with snake case name metrics to the statsd client when snakeCase=true', () => {
      const statsDClient = new StatsDClient({
        ...defaultOptions,
        snakeCase: true,
      });
      statsDClient.distribution(stat, value, tags);

      const stats = StatsDMock.mock.instances[0];
      const distributionFn = stats.distribution;
      expect(distributionFn).toHaveBeenCalledTimes(1);
      expect(distributionFn).toHaveBeenCalledWith(
        stat,
        value,
        undefined,
        {foo_bar: tagValue},
        expect.any(Function),
      );
    });

    it('calls errorHandler on the promise when the client returns an error', () => {
      const errorHandler = jest.fn();
      const statsDClient = new StatsDClient({...defaultOptions, errorHandler});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.distribution.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.distribution(stat, value, tags);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it("calls logger's log on the promise when the client returns an error and there is no errorHandler in options", () => {
      function logger() {}
      logger.log = () => {};
      const logSpy = jest.spyOn(logger, 'log');

      const statsDClient = new StatsDClient({...defaultOptions, logger});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.distribution.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.distribution(stat, value, tags);
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('timing', () => {
    it('passes timing metrics to the statsd client', () => {
      const statsDClient = new StatsDClient(defaultOptions);
      statsDClient.timing(stat, value, tags, {sampleRate});

      const stats = StatsDMock.mock.instances[0];
      const timingFn = stats.timing;
      expect(timingFn).toHaveBeenCalledTimes(1);
      expect(timingFn).toHaveBeenCalledWith(
        stat,
        value,
        sampleRate,
        tags,
        expect.any(Function),
      );
    });

    it('passes timing metrics with snake case name metrics to the statsd client when snakeCase=true', () => {
      const statsDClient = new StatsDClient({
        ...defaultOptions,
        snakeCase: true,
      });
      statsDClient.timing(stat, value, tags);

      const stats = StatsDMock.mock.instances[0];
      const timingFn = stats.timing;
      expect(timingFn).toHaveBeenCalledTimes(1);
      expect(timingFn).toHaveBeenCalledWith(
        stat,
        value,
        undefined,
        {foo_bar: tagValue},
        expect.any(Function),
      );
    });

    it('calls errorHandler on the promise when the client returns an error', () => {
      const errorHandler = jest.fn();
      const statsDClient = new StatsDClient({...defaultOptions, errorHandler});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.timing.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.timing(stat, value, tags);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it("calls logger's log on the promise when the client returns an error and there is no errorHandler in options", () => {
      function logger() {}
      logger.log = () => {};
      const logSpy = jest.spyOn(logger, 'log');

      const statsDClient = new StatsDClient({...defaultOptions, logger});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.timing.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.timing(stat, value, tags);
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('gauge', () => {
    it('passes gauge metrics to the statsd client', () => {
      const statsDClient = new StatsDClient(defaultOptions);
      statsDClient.gauge(stat, value, tags, {sampleRate});

      const stats = StatsDMock.mock.instances[0];
      const gaugeFn = stats.gauge;
      expect(gaugeFn).toHaveBeenCalledTimes(1);
      expect(gaugeFn).toHaveBeenCalledWith(
        stat,
        value,
        sampleRate,
        tags,
        expect.any(Function),
      );
    });

    it('passes gauge metrics with snake case name metrics to the statsd client when snakeCase=true', () => {
      const statsDClient = new StatsDClient({
        ...defaultOptions,
        snakeCase: true,
      });
      statsDClient.gauge(stat, value, tags);

      const stats = StatsDMock.mock.instances[0];
      const gaugeFn = stats.gauge;
      expect(gaugeFn).toHaveBeenCalledTimes(1);
      expect(gaugeFn).toHaveBeenCalledWith(
        stat,
        value,
        undefined,
        {foo_bar: tagValue},
        expect.any(Function),
      );
    });

    it('calls errorHandler on the promise when the client returns an error', () => {
      const errorHandler = jest.fn();
      const statsDClient = new StatsDClient({...defaultOptions, errorHandler});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.gauge.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.gauge(stat, value, tags);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it("calls logger's log on the promise when the client returns an error and there is no errorHandler in options", () => {
      function logger() {}
      logger.log = () => {};
      const logSpy = jest.spyOn(logger, 'log');

      const statsDClient = new StatsDClient({...defaultOptions, logger});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.gauge.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.gauge(stat, value, tags);
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('increment', () => {
    it('passes increment metrics to the statsd client', () => {
      const statsDClient = new StatsDClient(defaultOptions);
      statsDClient.increment(stat, tags, {sampleRate});

      const stats = StatsDMock.mock.instances[0];
      const incrementFn = stats.increment;
      expect(incrementFn).toHaveBeenCalledTimes(1);
      expect(incrementFn).toHaveBeenCalledWith(
        stat,
        1,
        sampleRate,
        tags,
        expect.any(Function),
      );
    });

    it('passes increment metrics with snake case name metrics to the statsd client when snakeCase=true', () => {
      const statsDClient = new StatsDClient({
        ...defaultOptions,
        snakeCase: true,
      });
      statsDClient.increment(stat, tags);

      const stats = StatsDMock.mock.instances[0];
      const incrementFn = stats.increment;
      expect(incrementFn).toHaveBeenCalledTimes(1);
      expect(incrementFn).toHaveBeenCalledWith(
        stat,
        1,
        undefined,
        {foo_bar: tagValue},
        expect.any(Function),
      );
    });

    it('increment can be passed a value input so that the metric is incremented by a specific amount', () => {
      const statsDClient = new StatsDClient({
        ...defaultOptions,
        snakeCase: true,
      });

      const amount = 4;

      statsDClient.increment(stat, tags, {}, amount);
      const stats = StatsDMock.mock.instances[0];
      const incrementFn = stats.increment;

      expect(incrementFn).toHaveBeenCalledTimes(1);
      expect(incrementFn).toHaveBeenCalledWith(
        stat,
        amount,
        undefined,
        {foo_bar: tagValue},
        expect.any(Function),
      );
    });

    it('calls errorHandler on the promise when the client returns an error', () => {
      const errorHandler = jest.fn();
      const statsDClient = new StatsDClient({...defaultOptions, errorHandler});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.increment.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.increment(stat, tags);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it("calls logger's log on the promise when the client returns an error and there is no errorHandler in options", () => {
      function logger() {}
      logger.log = () => {};
      const logSpy = jest.spyOn(logger, 'log');

      const statsDClient = new StatsDClient({...defaultOptions, logger});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.increment.mockImplementation(
        (_name, _value, _sampleRate, _tags, callback) => {
          callback(error);
        },
      );

      statsDClient.increment(stat, tags);
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it("calls statsd client's close function", () => {
      const statsDClient = new StatsDClient(defaultOptions);
      statsDClient.close();

      const stats = StatsDMock.mock.instances[0];
      const closeFn = stats.close;
      expect(closeFn).toHaveBeenCalledTimes(1);
      expect(closeFn).toHaveBeenCalledWith(expect.any(Function));
    });

    it('calls errorHandler on the promise when the client returns an error', () => {
      const errorHandler = jest.fn();
      const statsDClient = new StatsDClient({...defaultOptions, errorHandler});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.close.mockImplementation((callback) => {
        callback(error);
      });

      statsDClient.close();
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it("calls logger's log on the promise when the client returns an error and there is no errorHandler in options", () => {
      function logger() {}
      logger.log = () => {};
      const logSpy = jest.spyOn(logger, 'log');

      const statsDClient = new StatsDClient({...defaultOptions, logger});
      const statsDMock = StatsDMock.mock.instances[0];

      const error = new Error('Something went wrong!');
      statsDMock.close.mockImplementation((callback) => {
        callback(error);
      });

      statsDClient.close();
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('addGlobalTags', () => {
    it('uses the passed in global tags for future requests', () => {
      const statsDClient = new StatsDClient(defaultOptions);
      const forkedClient = new StatsDClient(defaultOptions);
      const childFn = StatsDMock.mock.instances[0].childClient as jest.Mock;
      childFn.mockReturnValueOnce(forkedClient);
      const supplementaryTags = {bbb: 'B'};

      statsDClient.addGlobalTags(supplementaryTags);

      expect(childFn).toHaveBeenCalledTimes(1);
      expect(childFn).toHaveBeenCalledWith({
        globalTags: supplementaryTags,
      });

      statsDClient.distribution(stat, value);

      expect(StatsDMock.mock.instances[0].distribution).not.toHaveBeenCalled();
      expect(StatsDMock.mock.instances[1].distribution).toHaveBeenCalled();
    });
  });

  describe('childClient', () => {
    it('uses the same StatsD client', () => {
      const options = {
        prefix: '.ChildClientPrefix',
        suffix: '.ChildClientSuffix',
        globalTags: {new: 'tag'},
      };

      const statsDClient = new StatsDClient(defaultOptions);
      const stats = StatsDMock.mock.instances[0];

      let childClient;
      let parentClient;
      jest.spyOn(stats, 'childClient').mockImplementationOnce((...options) => {
        const StatsD = jest.requireActual('hot-shots').StatsD;
        parentClient = new StatsD(defaultOptions);
        jest.spyOn(parentClient, 'childClient');
        childClient = parentClient.childClient(...options);
        return childClient;
      });

      statsDClient.childClient(options);

      expect(parentClient.childClient).toHaveBeenCalledWith({
        suffix: options.suffix,
        globalTags: options.globalTags,
      });
      expect(childClient.prefix).toBe(
        `${defaultOptions.prefix}${options.prefix}`,
      );
      expect(childClient.suffix).toBe(
        `${defaultOptions.suffix}${options.suffix}`,
      );
    });
  });
});
