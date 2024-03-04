import {faker} from '@faker-js/faker/locale/en';
import type {Performance, LifecycleEvent} from '@shopify/performance';
import {Navigation, NavigationResult, EventType} from '@shopify/performance';

import type {NavigationListener} from '../navigation-listener';
import type {LifecycleEventListener} from '../lifecycle-event-listener';

interface TestInterface {
  simulateNavigation(navigation?: Navigation): Navigation;
  simulateLifecycleEvent(event?: LifecycleEvent): LifecycleEvent;
}

type Event = 'navigation' | 'inflightNavigation' | 'lifecycleEvent';

export function mockPerformance(
  stubs: Partial<Performance> = {},
): Performance & TestInterface {
  let navigationListeners: NavigationListener[] = [];
  let lifecycleEventListeners: LifecycleEventListener[] = [];

  const {on, ...otherStubs} = stubs;

  return {
    on: (
      type: Event,
      listener: NavigationListener | LifecycleEventListener,
    ) => {
      if (type === 'navigation') {
        navigationListeners.push(listener as NavigationListener);
      } else if (type === 'lifecycleEvent') {
        lifecycleEventListeners.push(listener as LifecycleEventListener);
      }

      const customCleanup = on && on(type, listener);

      return () => {
        if (type === 'navigation') {
          navigationListeners = navigationListeners.filter(
            (item) => item !== listener,
          );
        } else if (type === 'lifecycleEvent') {
          lifecycleEventListeners = lifecycleEventListeners.filter(
            (item) => item !== listener,
          );
        }

        if (customCleanup) {
          customCleanup();
        }
      };
    },
    mark: noop,
    finish: noop,
    usable: noop,
    ...otherStubs,
    simulateNavigation(navigation: Navigation = mockNavigation()) {
      navigationListeners.forEach((listener) => {
        listener(navigation);
      });

      return navigation;
    },
    simulateLifecycleEvent(event: LifecycleEvent = mockLifecycleEvent()) {
      lifecycleEventListeners.forEach((listener) => {
        listener(event);
      });

      return event;
    },
  } as any;
}

export function mockLifecycleEvent(): LifecycleEvent {
  return {
    type: randomLifecycleEventType(),
    start: faker.number.int(),
    duration: faker.number.int(),
  } as any;
}

export function randomLifecycleEventType() {
  const types = [
    EventType.TimeToFirstByte,
    EventType.TimeToFirstPaint,
    EventType.TimeToFirstContentfulPaint,
    EventType.DomContentLoaded,
    EventType.FirstInputDelay,
    EventType.Load,
  ];

  return faker.helpers.arrayElement(types) as LifecycleEvent['type'];
}

export function mockNavigation() {
  return new Navigation(
    {
      start: faker.number.int({min: 0, max: 100000}),
      duration: faker.number.int({min: 0, max: 100000}),
      target: faker.internet.url(),
      events: [],
      result: NavigationResult.Finished,
    },
    {
      index: faker.number.int(),
      supportsDetailedEvents: faker.datatype.boolean(),
      supportsDetailedTime: faker.datatype.boolean(),
    },
  );
}

export function randomNavigationResult() {
  const resultTypes = [
    NavigationResult.Cancelled,
    NavigationResult.Finished,
    NavigationResult.TimedOut,
  ];

  return faker.helpers.arrayElement(resultTypes);
}

export function noop() {}

export function randomConnection() {
  const effectiveTypes = ['2g', '3g', '4g'];

  return {
    downlink: faker.number.int(),
    effectiveType: faker.helpers.arrayElement(effectiveTypes),
    onchange: null,
    rtt: faker.number.int(),
    saveData: faker.datatype.boolean(),
  };
}
