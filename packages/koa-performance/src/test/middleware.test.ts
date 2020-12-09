import {createMockContext} from '@shopify/jest-koa-mocks';
import {StatusCode, Method, Header} from '@shopify/network';
import {
  LifecycleEvent,
  EventType,
  Navigation,
  NavigationDefinition,
  NavigationResult,
  NavigationMetadata,
} from '@shopify/performance';
import withEnv from '@shopify/with-env';

import {clientPerformanceMetrics, Metrics} from '../middleware';

jest.mock('@shopify/statsd', () => {
  return {
    StatsDClient: class StatsDClient {
      static distributionSpy = jest.fn();
      static closeSpy = jest.fn();
      close = StatsDClient.closeSpy;
      distribution = StatsDClient.distributionSpy;
    },
  };
});

const config = {
  statsdHost: 'foo.com',
  statsdPort: 3000,
  prefix: 'tests',
  development: false,
  logger: {log: jest.fn()},
};

const StatsDClient = jest.requireMock('@shopify/statsd').StatsDClient;

describe('client metrics middleware', () => {
  beforeEach(() => {
    config.logger.log.mockReset();
    StatsDClient.distributionSpy.mockReset();
    StatsDClient.closeSpy.mockReset();
  });

  it('returns Ok if the request body contains metrics information', async () => {
    const context = createMockContext({
      method: Method.Post,
      requestBody: createBody(),
    });

    await withEnv('production', async () => {
      await clientPerformanceMetrics(config)(context);
    });

    expect(context.status).toBe(StatusCode.Ok);
  });

  it('returns UnprocessableEntity if the request body is missing keys', async () => {
    const context = createMockContext({
      method: Method.Post,
      requestBody: {},
    });

    await withEnv('production', async () => {
      await clientPerformanceMetrics(config)(context);
    });

    expect(context.status).toBe(StatusCode.UnprocessableEntity);
  });

  describe('tags', () => {
    it('includes connection speed data in distributions in snake_case', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          connection: {
            effectiveType: '3G',
          },
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      StatsDClient.distributionSpy.mock.calls.forEach(
        ([, , tags]: [never, never, any]) => {
          expect(tags).toHaveProperty('browser_connection_type', '3G');
        },
      );
    });

    it("sets connection speed data to 'Really fast' when it is above 5", async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          connection: {
            effectiveType: '3G',
          },
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      StatsDClient.distributionSpy.mock.calls.forEach(
        ([, , tags]: [never, never, any]) => {
          expect(tags).toHaveProperty('browser_connection_type', '3G');
        },
      );
    });

    it('sends connection tags as `Unknown` when data is missing', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          connection: {
            effectiveType: undefined,
          },
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      StatsDClient.distributionSpy.mock.calls.forEach(
        ([, , tags]: [never, never, any]) => {
          expect(tags).toHaveProperty('browser_connection_type', 'Unknown');
        },
      );
    });

    it('calls additionalTags with metrics body and the userAgent', async () => {
      const additionalTagsSpy = jest.fn(() => ({}));
      const body = createBody();
      const context = createMockContext({
        method: Method.Post,
        requestBody: body,
        headers: {
          [Header.UserAgent]: 'something',
        },
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics({
          ...config,
          additionalTags: additionalTagsSpy,
        })(context);
      });

      expect(additionalTagsSpy).toHaveBeenCalledWith(
        body,
        context.get(Header.UserAgent),
      );
    });

    it('includes additionalTags for each metric', async () => {
      const additionalTags = {fooBar: true};
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [createLifecycleEvent()],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics({
          ...config,
          additionalTags: () => additionalTags,
        })(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining(additionalTags),
      );
    });

    it('includes locale in distributions', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          connection: {
            effectiveType: '3G',
          },
          locale: 'es',
          events: [createLifecycleEvent()],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
        expect.objectContaining({
          locale: 'es',
        }),
      );
    });

    it('omits undefined locales from distributions', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          connection: {
            effectiveType: '3G',
          },
          locale: undefined,
          events: [createLifecycleEvent()],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).not.toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
        expect.objectContaining({locale: expect.anything()}),
      );
    });
  });

  describe('events', () => {
    it('sends distributions for each event in snake_case', async () => {
      const ttfbEvent = createLifecycleEvent(EventType.TimeToFirstByte, 123);
      const ttfcpEvent = createLifecycleEvent(
        EventType.TimeToFirstContentfulPaint,
        123,
      );

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [ttfbEvent, ttfcpEvent],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'time_to_first_byte',
        ttfbEvent.start,
        expect.any(Object),
      );

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'time_to_first_contentful_paint',
        ttfcpEvent.start,
        expect.any(Object),
      );
    });

    it('sends distribution for first-input-delay duration', async () => {
      const firstInputDelayEvent = createLifecycleEvent(
        EventType.FirstInputDelay,
        123,
        456,
      );

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [firstInputDelayEvent],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'first_input_delay',
        456,
        expect.any(Object),
      );
    });
  });

  describe('navigations', () => {
    it('sends distributions for time to complete and usable', async () => {
      const complete = 123;
      const usable = 99;
      const navigation = createNavigation({
        duration: complete,
        events: [
          {
            type: EventType.Usable,
            duration: 0,
            start: usable,
          },
        ],
      });

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [navigation],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_complete',
        complete,
        expect.any(Object),
      );

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_usable',
        usable,
        expect.any(Object),
      );
    });

    it('does not send cache_effectiveness and download_size metrics by default', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [createNavigation()],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).not.toHaveBeenCalledWith(
        'navigation_download_size',
        expect.any(Number),
        expect.any(Object),
      );

      expect(StatsDClient.distributionSpy).not.toHaveBeenCalledWith(
        'navigation_cache_effectiveness',
        expect.any(Number),
        expect.any(Object),
      );
    });

    it('sends cache_effectiveness and download_size if available', async () => {
      const size = 12345;
      const navigation = createNavigation({
        events: [
          {
            type: EventType.ScriptDownload,
            duration: 50,
            start: 0,
            metadata: {
              name: 'script.js',
              size,
            },
          },
        ],
      });

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [navigation],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_cache_effectiveness',
        0,
        expect.any(Object),
      );

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_download_size',
        size,
        expect.any(Object),
      );
    });

    it('attaches custom tags from the config', async () => {
      const additionalTags = {fooBar: 'baz'};
      const spy = jest.fn(() => additionalTags);
      const navigation = createNavigation();

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [navigation],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics({
          ...config,
          additionalNavigationTags: spy,
        })(context);
      });

      expect(spy).toHaveBeenCalledWith(expect.any(Navigation));
      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_complete',
        expect.any(Number),
        expect.objectContaining(additionalTags),
      );
    });

    it('sends custom metrics from the config', async () => {
      const additionalMetric = {name: 'navigation_metric', value: 123};
      const spy = jest.fn(() => [additionalMetric]);
      const navigation = createNavigation();

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [navigation],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics({
          ...config,
          additionalNavigationMetrics: spy,
        })(context);
      });

      expect(spy).toHaveBeenCalledWith(expect.any(Navigation));
      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        additionalMetric.name,
        additionalMetric.value,
        expect.any(Object),
      );
    });

    it('attaches anomalous:true tag if anomalousNavigationDurationThreshold is exceeded', async () => {
      const anomalousNavigationDurationThreshold = 10000;
      const navigation = createNavigation({
        duration: anomalousNavigationDurationThreshold + 1,
      });

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [navigation],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics({
          ...config,
          anomalousNavigationDurationThreshold,
        })(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_complete',
        expect.any(Number),
        expect.objectContaining({anomalous: true}),
      );
    });

    it('attaches anomalous:false tag if anomalousNavigationDurationThreshold is not exceeded', async () => {
      const anomalousNavigationDurationThreshold = 10000;
      const navigation = createNavigation({
        duration: anomalousNavigationDurationThreshold - 1,
      });

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          navigations: [navigation],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics({
          ...config,
          anomalousNavigationDurationThreshold,
        })(context);
      });

      expect(StatsDClient.distributionSpy).toHaveBeenCalledWith(
        'navigation_complete',
        expect.any(Number),
        expect.objectContaining({anomalous: false}),
      );
    });
  });

  describe('development', () => {
    it('does not send metrics', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [createLifecycleEvent()],
        }),
      });

      await withEnv('development', async () => {
        await clientPerformanceMetrics({...config, development: true})(context);
      });

      expect(StatsDClient.distributionSpy).not.toHaveBeenCalled();
    });

    it('logs distributions', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [createLifecycleEvent()],
        }),
      });

      await withEnv('development', async () => {
        await clientPerformanceMetrics({...config, development: true})(context);
      });

      expect(config.logger.log).toHaveBeenCalled();
    });
  });
});

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends any[]
    ? T[K]
    : T[K] extends object
    ? DeepPartial<T[K]>
    : T[K];
};

function createBody({
  connection,
  events = [],
  locale,
  navigations = [],
  pathname = '/some-path',
}: DeepPartial<Metrics> = {}): Metrics {
  return {
    connection: {
      downlink: 29,
      effectiveType: '4G',
      ...connection,
    },
    events,
    locale,
    navigations,
    pathname,
  };
}

function createLifecycleEvent(
  type: LifecycleEvent['type'] = EventType.TimeToFirstByte,
  time = 100,
  duration = 0,
) {
  return {
    type,
    duration,
    start: time,
  } as LifecycleEvent;
}

function createNavigation(
  navigation: DeepPartial<NavigationDefinition> = {},
  metadata: Partial<NavigationMetadata> = {},
): {details: NavigationDefinition; metadata: NavigationMetadata} {
  return {
    details: {
      target: '/some-page',
      duration: 100,
      start: 0,
      result: NavigationResult.Finished,
      events: [],
      ...navigation,
    },
    metadata: {
      supportsDetailedTime: true,
      supportsDetailedEvents: false,
      index: 1,
      ...metadata,
    },
  };
}
