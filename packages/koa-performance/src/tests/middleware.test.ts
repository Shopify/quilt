import {createMockContext} from '@shopify/jest-koa-mocks';
import {StatusCode, Method, Header} from '@shopify/network';
import type {
  LifecycleEvent,
  NavigationDefinition,
  NavigationMetadata,
} from '@shopify/performance';
import {EventType, Navigation, NavigationResult} from '@shopify/performance';
import withEnv from '@shopify/with-env';

import type {Metrics} from '../middleware';
import {clientPerformanceMetrics} from '../middleware';

jest.mock('@shopify/statsd');
const StatsDClient = jest.requireMock('@shopify/statsd').StatsDClient;
const statsd = new StatsDClient({
  host: 'foo.com',
  port: 3000,
  prefix: 'test',
});

const config = {
  statsd,
  development: false,
  logger: {log: jest.fn()},
};

describe('client metrics middleware', () => {
  beforeEach(() => {
    config.logger.log.mockReset();
    statsd.distribution.mockReset();
  });

  it('returns Ok if the request body contains metrics information', async () => {
    const context = createMockContext({
      method: Method.Post,
      requestBody: createBody(),
    });

    await withEnv('production', async () => {
      await clientPerformanceMetrics(config)(context, () => Promise.resolve());
    });

    expect(context.status).toBe(StatusCode.Ok);
  });

  it('returns UnprocessableEntity if the request body is missing keys', async () => {
    const context = createMockContext({
      method: Method.Post,
      requestBody: {},
    });

    await withEnv('production', async () => {
      await clientPerformanceMetrics(config)(context, () => Promise.resolve());
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      statsd.distribution.mock.calls.forEach(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      statsd.distribution.mock.calls.forEach(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      statsd.distribution.mock.calls.forEach(
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
        })(context, () => Promise.resolve());
      });

      expect(additionalTagsSpy).toHaveBeenCalledWith(
        body,
        context.get(Header.UserAgent),
        context,
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
        })(context, () => Promise.resolve());
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).not.toHaveBeenCalledWith(
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
      const ttlcpEvent = createLifecycleEvent(
        EventType.TimeToLargestContentfulPaint,
        456,
      );

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [ttfbEvent, ttfcpEvent, ttlcpEvent],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'time_to_first_byte',
        ttfbEvent.start,
        expect.any(Object),
      );

      expect(statsd.distribution).toHaveBeenCalledWith(
        'time_to_first_contentful_paint',
        ttfcpEvent.start,
        expect.any(Object),
      );

      expect(statsd.distribution).toHaveBeenCalledWith(
        'time_to_largest_contentful_paint',
        ttlcpEvent.start,
        expect.any(Object),
      );
    });

    it('sends distribution for redirect_duration when ttfb is supplied with relevant metadata', async () => {
      const ttfbEvent = createLifecycleEvent(
        EventType.TimeToFirstByte,
        123,
        100,
        {redirectDuration: 50},
      );

      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [ttfbEvent],
        }),
      });

      await withEnv('production', async () => {
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'redirect_duration',
        ttfbEvent.metadata?.redirectDuration,
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'navigation_complete',
        complete,
        expect.any(Object),
      );

      expect(statsd.distribution).toHaveBeenCalledWith(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).not.toHaveBeenCalledWith(
        'navigation_download_size',
        expect.any(Number),
        expect.any(Object),
      );

      expect(statsd.distribution).not.toHaveBeenCalledWith(
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
        await clientPerformanceMetrics(config)(context, () =>
          Promise.resolve(),
        );
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'navigation_cache_effectiveness',
        0,
        expect.any(Object),
      );

      expect(statsd.distribution).toHaveBeenCalledWith(
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
        })(context, () => Promise.resolve());
      });

      expect(spy).toHaveBeenCalledWith(expect.any(Navigation), context);
      expect(statsd.distribution).toHaveBeenCalledWith(
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
        })(context, () => Promise.resolve());
      });

      expect(spy).toHaveBeenCalledWith(expect.any(Navigation), context);
      expect(statsd.distribution).toHaveBeenCalledWith(
        additionalMetric.name,
        additionalMetric.value,
        expect.any(Object),
      );
    });

    it('sends custom tags for navigation metrics', async () => {
      const additionalMetric = {
        name: 'navigation_metric',
        value: 123,
        tags: {name: 'custom tag'},
      };
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
          additionalNavigationMetrics: () => [additionalMetric],
        })(context, () => Promise.resolve());
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        additionalMetric.name,
        additionalMetric.value,
        expect.objectContaining(additionalMetric.tags),
      );
    });

    it('attaches anomalous:true tag if anomalousNavigationThreshold for duration is exceeded', async () => {
      const anomalousNavigationDurationThreshold = 30_000;

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
        })(context, () => Promise.resolve());
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'navigation_complete',
        expect.any(Number),
        expect.objectContaining({anomalous: true}),
      );
    });

    it('attaches anomalous:false tag if anomalousNavigationThreshold for duration is not exceeded', async () => {
      const anomalousNavigationDurationThreshold = 30_000;

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
        })(context, () => Promise.resolve());
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'navigation_complete',
        expect.any(Number),
        expect.objectContaining({anomalous: false}),
      );
    });

    it('attaches anomalous:true tag if anomalousNavigationThreshold for downloadSize is exceeded', async () => {
      const anomalousNavigationDurationThreshold = 1_500_000;
      const anomalousNavigationDownloadSizeThreshold = 30_000;

      const navigation = createNavigation({
        events: [
          {
            type: EventType.ScriptDownload,
            start: 0,
            duration: anomalousNavigationDurationThreshold - 1,
            metadata: {
              name: 'https://some-page/assets/app.js',
              size: anomalousNavigationDownloadSizeThreshold + 1,
              cached: false,
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
        await clientPerformanceMetrics({
          ...config,
          anomalousNavigationDurationThreshold,
          anomalousNavigationDownloadSizeThreshold,
        })(context, () => Promise.resolve());
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'navigation_download_size',
        expect.any(Number),
        expect.objectContaining({anomalous: true}),
      );
    });

    it('attaches anomalous:false tag if anomalousNavigationThreshold for downloadSize is not exceeded', async () => {
      const anomalousNavigationDurationThreshold = 1_500_000;
      const anomalousNavigationDownloadSizeThreshold = 30_000;

      const navigation = createNavigation({
        events: [
          {
            type: EventType.ScriptDownload,
            start: 0,
            duration: anomalousNavigationDurationThreshold + 1,
            metadata: {
              name: 'https://some-page/assets/app.js',
              size: anomalousNavigationDownloadSizeThreshold - 1,
              cached: false,
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
        await clientPerformanceMetrics({
          ...config,
          anomalousNavigationDurationThreshold,
          anomalousNavigationDownloadSizeThreshold,
        })(context, () => Promise.resolve());
      });

      expect(statsd.distribution).toHaveBeenCalledWith(
        'navigation_download_size',
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
        await clientPerformanceMetrics({...config, development: true})(
          context,
          () => Promise.resolve(),
        );
      });

      expect(statsd.distribution).not.toHaveBeenCalled();
    });

    it('logs distributions', async () => {
      const context = createMockContext({
        method: Method.Post,
        requestBody: createBody({
          events: [createLifecycleEvent()],
        }),
      });

      await withEnv('development', async () => {
        await clientPerformanceMetrics({...config, development: true})(
          context,
          () => Promise.resolve(),
        );
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
  metadata?: {[key: string]: any},
) {
  return {
    type,
    duration,
    start: time,
    metadata,
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
