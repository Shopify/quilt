import {Navigation} from '../navigation';
import {
  NavigationDefinition,
  NavigationMetadata,
  NavigationResult,
  CustomEvent,
  ScriptDownloadEvent,
  EventType,
  StyleDownloadEvent,
  LifecycleEvent,
  EventMap,
} from '../types';

describe('Navigation', () => {
  it('has a start time', () => {
    const start = Date.now();
    const navigation = createNavigation({start});
    expect(navigation).toHaveProperty('start', start);
  });

  it('has a duration', () => {
    const duration = 123;
    const navigation = createNavigation({duration});
    expect(navigation).toHaveProperty('duration', duration);
  });

  it('has a result', () => {
    const result = NavigationResult.Cancelled;
    const navigation = createNavigation({result});
    expect(navigation).toHaveProperty('result', result);
  });

  it('has a target', () => {
    const target = '/foobar';
    const navigation = createNavigation({target});
    expect(navigation).toHaveProperty('target', target);
  });

  it('has metadata', () => {
    const metadata = {
      index: 1,
      supportsDetailedEvents: false,
      supportsDetailedTime: true,
    };
    const navigation = createNavigation(undefined, metadata);
    expect(navigation).toHaveProperty(
      'metadata',
      expect.objectContaining(metadata),
    );
  });

  describe('#isFullPageNavigation', () => {
    it('is true when the navigation is index 0', () => {
      const navigation = createNavigation(undefined, {index: 0});
      expect(navigation).toHaveProperty('isFullPageNavigation', true);
    });

    it('is false when the navigation is not index 0', () => {
      const navigation = createNavigation(undefined, {index: 2});
      expect(navigation).toHaveProperty('isFullPageNavigation', false);
    });
  });

  describe('#timeToComplete', () => {
    it('is the duration of the navigation', () => {
      const duration = 123;
      expect(createNavigation({duration})).toHaveProperty(
        'timeToComplete',
        duration,
      );
    });
  });

  describe('#timeToUsable', () => {
    it('is the time to complete when no "usable" events were triggered', () => {
      const navigation = createNavigation();
      expect(navigation).toHaveProperty(
        'timeToUsable',
        navigation.timeToComplete,
      );
    });

    it('is the start time of the "usable" event when available, relative to when the navigation started', () => {
      const navigationStart = 12;
      const event = {type: EventType.Usable, duration: 0, start: 123};
      const navigation = createNavigation({
        events: [event],
        start: navigationStart,
      });
      expect(navigation).toHaveProperty(
        'timeToUsable',
        event.start - navigationStart,
      );
    });
  });

  describe('#resourceEvents', () => {
    it('does not return non-resource events', () => {
      const navigation = createNavigation({events: [createGenericEvent()]});
      expect(navigation.resourceEvents).toHaveLength(0);
    });

    it('returns script download events', () => {
      const event = createScriptDownloadEvent();
      const navigation = createNavigation({
        events: [event],
      });
      expect(navigation.resourceEvents).toStrictEqual([event]);
    });

    it('returns style download events', () => {
      const event = createStyleDownloadEvent();
      const navigation = createNavigation({
        events: [event],
      });
      expect(navigation.resourceEvents).toStrictEqual([event]);
    });
  });

  describe('#totalDownloadSize', () => {
    it('is undefined when there are no resource downloads', () => {
      const navigation = createNavigation();
      expect(navigation).toHaveProperty('totalDownloadSize', undefined);
    });

    it('is undefined when any resource downloads have an undefined size', () => {
      const navigation = createNavigation({
        events: [
          createScriptDownloadEvent({metadata: {size: 100}}),
          createStyleDownloadEvent({metadata: {size: undefined}}),
        ],
      });
      expect(navigation).toHaveProperty('totalDownloadSize', undefined);
    });

    it('sums the size of all resource downloads', () => {
      const navigation = createNavigation({
        events: [
          createScriptDownloadEvent({metadata: {size: 100}}),
          createStyleDownloadEvent({metadata: {size: 250}}),
        ],
      });
      expect(navigation).toHaveProperty('totalDownloadSize', 350);
    });
  });

  describe('#cacheEffectiveness', () => {
    it('is undefined when there are no resource downloads', () => {
      const navigation = createNavigation();
      expect(navigation).toHaveProperty('cacheEffectiveness', undefined);
    });

    it('is undefined when any resource downloads have an undefined size', () => {
      const navigation = createNavigation({
        events: [
          createScriptDownloadEvent({metadata: {size: 100}}),
          createStyleDownloadEvent({metadata: {size: undefined}}),
        ],
      });
      expect(navigation).toHaveProperty('cacheEffectiveness', undefined);
    });

    it('returns a ratio of cached (size = 0) resources to uncached ones', () => {
      const navigation = createNavigation({
        events: [
          createScriptDownloadEvent({metadata: {size: 0}}),
          createScriptDownloadEvent({metadata: {size: 0}}),
          createStyleDownloadEvent({metadata: {size: 250}}),
        ],
      });
      expect(navigation).toHaveProperty('cacheEffectiveness', 2 / 3);
    });
  });

  describe('#eventsByType()', () => {
    it('filters to only the matching events', () => {
      const type = 'my-type';
      const events = [
        createGenericEvent({type}),
        createGenericEvent({type: 'another-type'}),
        createGenericEvent({type}),
      ];
      const navigation = createNavigation({events});
      expect(navigation.eventsByType(type)).toStrictEqual([
        events[0],
        events[2],
      ]);
    });
  });

  describe('#totalDurationByEventType()', () => {
    it('sums up the duration of non-overlapping events', () => {
      const type = 'my-type';
      const events = [
        createGenericEvent({type, start: 0, duration: 100}),
        createGenericEvent({type, start: 200, duration: 150}),
      ];
      const navigation = createNavigation({events, start: 0});
      expect(navigation.totalDurationByEventType(type)).toBe(250);
    });

    it('sums up the duration of partially-overlapping events', () => {
      const type = 'my-type';
      const events = [
        createGenericEvent({type, start: 0, duration: 100}),
        createGenericEvent({type, start: 50, duration: 150}),
      ];
      const navigation = createNavigation({events, start: 0});
      expect(navigation.totalDurationByEventType(type)).toBe(200);
    });

    it('sums up the duration of fully-overlapping events', () => {
      const type = 'my-type';
      const events = [
        createGenericEvent({type, start: 0, duration: 300}),
        createGenericEvent({type, start: 50, duration: 150}),
      ];
      const navigation = createNavigation({events, start: 0});
      expect(navigation.totalDurationByEventType(type)).toBe(300);
    });

    it('only counts time after the navigation actually started', () => {
      const type = 'my-type';
      const eventStart = 50;
      const navigationStart = 100;
      const eventDuration = 300;
      const events = [
        createGenericEvent({type, start: eventStart, duration: eventDuration}),
      ];
      const navigation = createNavigation({events, start: navigationStart});
      expect(navigation.totalDurationByEventType(type)).toBe(
        eventDuration - (navigationStart - eventStart),
      );
    });
  });

  describe('#toJSON()', () => {
    it('always returns the basic fields', () => {
      const basicDetails = {
        start: 0,
        duration: 1000,
        target: '/admin',
        result: NavigationResult.TimedOut,
      };
      expect(createNavigation(basicDetails).toJSON()).toMatchObject(
        basicDetails,
      );
    });

    it('removes all lifecycle events by default', () => {
      const nonLifecycleEvent = createGenericEvent();
      const events = [
        createLifecycleEventEvent(EventType.TimeToFirstByte),
        createLifecycleEventEvent(EventType.TimeToFirstPaint),
        createLifecycleEventEvent(EventType.TimeToFirstContentfulPaint),
        createLifecycleEventEvent(EventType.DomContentLoaded),
        createLifecycleEventEvent(EventType.FirstInputDelay),
        createLifecycleEventEvent(EventType.Load),
        nonLifecycleEvent,
      ];

      expect(createNavigation({events}).toJSON()).toHaveProperty('events', [
        nonLifecycleEvent,
      ]);
    });

    it('includes lifecycle events when removeLifecycleEvents is false', () => {
      const nonLifecycleEvent = createGenericEvent();
      const events = [
        createLifecycleEventEvent(EventType.TimeToFirstByte),
        createLifecycleEventEvent(EventType.TimeToFirstPaint),
        createLifecycleEventEvent(EventType.TimeToFirstContentfulPaint),
        createLifecycleEventEvent(EventType.DomContentLoaded),
        createLifecycleEventEvent(EventType.FirstInputDelay),
        createLifecycleEventEvent(EventType.Load),
        nonLifecycleEvent,
      ];

      expect(
        createNavigation({events}).toJSON({removeLifecycleEvents: false}),
      ).toHaveProperty('events', events);
    });

    it('removes event metadata by default', () => {
      const event = createGenericEvent({
        metadata: {foo: 'bar'},
      });

      expect(createNavigation({events: [event]}).toJSON()).not.toHaveProperty(
        'events.0.metadata',
      );
    });

    it('preserves event metadata when removeEventMetadata is false', () => {
      const event = createGenericEvent({
        metadata: {foo: 'bar'},
      });

      expect(
        createNavigation({events: [event]}).toJSON({
          removeEventMetadata: false,
        }),
      ).toHaveProperty('events.0.metadata', event.metadata);
    });
  });
});

function createGenericEvent(event: Partial<CustomEvent> = {}): CustomEvent {
  return {
    type: 'event',
    duration: 0,
    start: 0,
    ...event,
  };
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

function createScriptDownloadEvent(
  event: DeepPartial<ScriptDownloadEvent> = {},
): ScriptDownloadEvent {
  return {
    type: EventType.ScriptDownload,
    duration: 0,
    start: 0,
    ...event,
    metadata: {name: 'script.js', ...event.metadata},
  };
}

function createStyleDownloadEvent(
  event: DeepPartial<StyleDownloadEvent> = {},
): StyleDownloadEvent {
  return {
    type: EventType.StyleDownload,
    duration: 0,
    start: 0,
    ...event,
    metadata: {name: 'style.css', ...event.metadata},
  };
}

function createLifecycleEventEvent<T extends LifecycleEvent['type']>(
  type: T,
): EventMap[T] {
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  return {
    type,
    duration: 0,
    start: 0,
  } as LifecycleEvent;
}

function createNavigation(
  details: Partial<NavigationDefinition> = {},
  metadata: Partial<NavigationMetadata> = {},
) {
  return new Navigation(
    {
      start: Date.now(),
      duration: 100,
      events: [],
      result: NavigationResult.Finished,
      target: '/admin',
      ...details,
    },
    {
      index: 0,
      supportsDetailedEvents: true,
      supportsDetailedTime: true,
      ...metadata,
    },
  );
}
