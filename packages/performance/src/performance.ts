import {InflightNavigation} from './inflight';
import {Navigation} from './navigation';
import {
  now,
  withEntriesOfType,
  withNavigation,
  withTiming,
  supportsPerformanceObserver,
  referenceTime,
  hasGlobal,
} from './utilities';
import {
  Event,
  EventType,
  LifecycleEvent,
  TimeToFirstPaintEvent,
  TimeToFirstContentfulPaintEvent,
} from './types';

const WATCH_RESOURCE_TYPES = ['script', 'css'];

interface EventMap {
  navigation: (navigation: Navigation) => void;
  inflightNavigation: () => void;
  lifecycleEvent: (event: LifecycleEvent) => void;
}

const DEFAULT_TIMEOUT = 60_000;

export class Performance {
  readonly supportsObserver = hasGlobal('PerformanceObserver');
  readonly supportsMarks = hasGlobal('PerformanceMark');
  readonly supportsNavigationEntries = hasGlobal('PerformanceNavigationTiming');
  readonly supportsLongtaskEntries = hasGlobal('PerformanceLongTaskTiming');
  readonly supportsResourceEntries = hasGlobal('PerformanceResourceTiming');
  readonly supportsPaintEntries = hasGlobal('PerformancePaintTiming');

  readonly timeOrigin = referenceTime();
  readonly supportsDetailedTime = supportsPerformanceObserver;
  readonly supportsDetailedEvents =
    this.supportsNavigationEntries &&
    this.supportsLongtaskEntries &&
    this.supportsResourceEntries &&
    this.supportsPaintEntries;

  private inflightNavigation?: InflightNavigation;
  private navigationTimeout?: ReturnType<typeof setTimeout>;
  private firstNavigation?: Navigation;
  private lifecycleEvents: LifecycleEvent[] = [];
  private navigationCount = 0;
  private eventHandlers = {
    navigation: new Set<EventMap['navigation']>(),
    inflightNavigation: new Set<EventMap['inflightNavigation']>(),
    lifecycleEvent: new Set<EventMap['lifecycleEvent']>(),
  };

  constructor() {
    this.start({timeStamp: 0});

    withNavigation(this.start.bind(this));

    if (!this.supportsDetailedTime || !this.supportsNavigationEntries) {
      withTiming(
        ({responseStart, domContentLoadedEventStart, loadEventStart}) => {
          this.lifecycleEvent({
            type: EventType.TimeToFirstByte,
            start: responseStart - this.timeOrigin,
            duration: 0,
          });

          this.lifecycleEvent({
            type: EventType.DomContentLoaded,
            start: domContentLoadedEventStart - this.timeOrigin,
            duration: 0,
          });

          this.lifecycleEvent({
            type: EventType.Load,
            start: loadEventStart - this.timeOrigin,
            duration: 0,
          });
        },
      );
    } else {
      withEntriesOfType('navigation', entry => {
        this.lifecycleEvent({
          type: EventType.TimeToFirstByte,
          start: entry.responseStart,
          duration: 0,
        });

        if (entry.domContentLoadedEventStart > 0) {
          this.lifecycleEvent({
            type: EventType.DomContentLoaded,
            start: entry.domContentLoadedEventStart,
            duration: 0,
          });
        }

        if (entry.loadEventStart > 0) {
          this.lifecycleEvent({
            type: EventType.Load,
            start: entry.loadEventStart,
            duration: 0,
          });
        }
      });
    }

    if (this.supportsResourceEntries) {
      withEntriesOfType('resource', entry => {
        if (!WATCH_RESOURCE_TYPES.includes(entry.initiatorType)) {
          return;
        }

        this.event(
          {
            type:
              entry.initiatorType === 'script'
                ? EventType.ScriptDownload
                : EventType.StyleDownload,
            start: entry.startTime,
            duration: entry.duration,
            metadata: {
              name: entry.name,
              size: entry.encodedBodySize,
            },
          },
          {replace: true},
        );
      });
    }

    if (this.supportsLongtaskEntries) {
      withEntriesOfType('longtask', entry => {
        this.event({
          type: EventType.LongTask,
          start: entry.startTime,
          duration: entry.duration,
        });
      });
    }

    if (this.supportsPaintEntries) {
      withEntriesOfType('paint', entry => {
        const type =
          entry.name === 'first-paint'
            ? EventType.TimeToFirstPaint
            : EventType.TimeToFirstContentfulPaint;

        this.lifecycleEvent({type, start: entry.startTime, duration: 0} as
          | TimeToFirstPaintEvent
          | TimeToFirstContentfulPaintEvent);
      });
    }
  }

  on<T extends keyof EventMap>(event: T, handler: EventMap[T]) {
    const handlers = this.eventHandlers[event] as Set<any>;
    handlers.add(handler);

    // If they are registering to hear about completed navigations, and we have already
    // completed the first load, tell them about it. This allows them to bind to the
    // listener later and still feel as if they had registered as early as possible.
    if (
      event === 'navigation' &&
      this.firstNavigation != null &&
      this.navigationCount === 1
    ) {
      (handler as EventMap['navigation'])(this.firstNavigation);
    }

    // If they are registered to here about new navigations, and one is in flight,
    // tell them right away.
    if (event === 'inflightNavigation' && this.inflightNavigation != null) {
      (handler as EventMap['inflightNavigation'])();
    }

    if (event === 'lifecycleEvent') {
      for (const event of this.lifecycleEvents) {
        (handler as EventMap['lifecycleEvent'])(event);
      }
    }

    return () => handlers.delete(handler);
  }

  event(event: Event, {replace = false} = {}) {
    if (this.inflightNavigation == null) {
      return;
    }

    this.inflightNavigation.event(event, replace);
  }

  start({
    timeStamp = now(),
    target = window.location.pathname,
    timeout = DEFAULT_TIMEOUT,
  } = {}) {
    this.clearTimeout();

    if (this.inflightNavigation) {
      this.record(this.inflightNavigation.cancel(timeStamp));
    }

    this.inflightNavigation = new InflightNavigation(
      {
        timeOrigin: this.timeOrigin,
        start: timeStamp,
        target,
      },
      {
        index: this.navigationCount,
        supportsDetailedTime: this.supportsDetailedTime,
        supportsDetailedEvents: this.supportsDetailedEvents,
      },
    );

    this.navigationTimeout = setTimeout(() => this.timeout.bind(this), timeout);

    for (const subscriber of this.eventHandlers.inflightNavigation) {
      subscriber();
    }
  }

  usable(timeStamp = now()) {
    this.event(
      {
        type: EventType.Usable,
        start: timeStamp,
        duration: 0,
      },
      {replace: true},
    );
  }

  finish(timeStamp = now()) {
    this.clearTimeout();

    if (this.inflightNavigation == null) {
      return;
    }

    const navigation = this.inflightNavigation.finish(timeStamp);

    this.firstNavigation = this.firstNavigation || navigation;
    this.record(navigation);
    this.inflightNavigation = undefined;
  }

  private lifecycleEvent(event: LifecycleEvent) {
    if (this.lifecycleEvents.find(({type}) => type === event.type) != null) {
      return;
    }

    this.event(event);
    this.lifecycleEvents.push(event);

    for (const handler of this.eventHandlers.lifecycleEvent) {
      handler(event);
    }
  }

  private timeout() {
    this.clearTimeout();

    if (this.inflightNavigation == null) {
      return;
    }

    this.record(this.inflightNavigation.timeout());
  }

  private clearTimeout() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
      this.navigationTimeout = undefined;
    }
  }

  private record(navigation: Navigation) {
    this.navigationCount += 1;

    for (const subscriber of this.eventHandlers.navigation) {
      subscriber(navigation);
    }
  }
}
