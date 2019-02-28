import {
  Event,
  EventType,
  NavigationDefinition,
  NavigationResult,
  NavigationMetadata,
  LifecycleEvent,
  ScriptDownloadEvent,
  StyleDownloadEvent,
  EventMap,
} from './types';
import {getUniqueRanges} from './utilities';

const LIFECYCLE_EVENTS: LifecycleEvent['type'][] = [
  EventType.TimeToFirstByte,
  EventType.TimeToFirstPaint,
  EventType.TimeToFirstContentfulPaint,
  EventType.DomContentLoaded,
  EventType.FirstInputDelay,
  EventType.Load,
];

export class Navigation implements NavigationDefinition {
  start: number;
  duration: number;
  target: string;
  events: Event[];
  result: NavigationResult;

  get isFullPageNavigation() {
    return this.metadata.index === 0;
  }

  constructor(
    {start, duration, target, events, result}: NavigationDefinition,
    public metadata: NavigationMetadata,
  ) {
    this.start = start;
    this.duration = duration;
    this.target = target;
    this.events = events;
    this.result = result;
  }

  eventsByType<T extends Event['type'], EventType = EventMap[T]>(
    targetType: T,
  ): EventType[] {
    return this.events.filter(({type}) => type === targetType) as any[];
  }

  totalDurationByEventType(type: Event['type'], {countOverlaps = false} = {}) {
    const events = this.eventsByType(type);

    if (events.length === 0) {
      return 0;
    }

    const ranges = countOverlaps ? events : getUniqueRanges(events);
    return ranges.reduce((total, {duration}) => total + duration, 0);
  }

  get timeToComplete() {
    return this.duration;
  }

  get timeToUsable() {
    const usableEvent = this.eventsByType(EventType.Usable)[0];
    return usableEvent ? usableEvent.start - this.start : this.timeToComplete;
  }

  get resourceEvents(): (ScriptDownloadEvent | StyleDownloadEvent)[] {
    return [
      ...this.eventsByType(EventType.ScriptDownload),
      ...this.eventsByType(EventType.StyleDownload),
    ];
  }

  get totalDownloadSize() {
    const events = this.resourceEvents;

    if (events.length === 0) {
      return undefined;
    }

    return events.reduce<number | undefined>(
      (total, {metadata: {size}}) =>
        size == null || typeof total !== 'number' ? undefined : total + size,
      0,
    );
  }

  get cacheEffectiveness() {
    const events = this.resourceEvents;

    if (
      events.length === 0 ||
      events.some(({metadata: {size}}) => size == null)
    ) {
      return undefined;
    }

    return (
      events.filter(({metadata: {size}}) => size === 0).length / events.length
    );
  }

  toJSON({
    removeEventMetadata = true,
    removeLifecycleEvents = true,
  } = {}): NavigationDefinition {
    const events = removeLifecycleEvents
      ? this.events.filter(
          ({type}) =>
            !LIFECYCLE_EVENTS.includes(type as LifecycleEvent['type']),
        )
      : this.events;

    const processedEvents = removeEventMetadata
      ? events.map(({metadata, ...rest}) => rest)
      : events;

    return {
      start: this.start,
      duration: this.duration,
      target: this.target,
      events: processedEvents,
      result: this.result,
    };
  }
}
