import {now} from './utilities';
import {
  Event,
  NavigationResult,
  NavigationMetadata,
  EventType,
  ScriptDownloadEvent,
  StyleDownloadEvent,
} from './types';
import {Navigation} from './navigation';

interface NavigationStartOptions {
  timeOrigin: number;
  target?: string;
  start?: number;
}

function replaceResourceEvent(event: Event, oldEvent: Event) {
  if (
    (event.type !== EventType.ScriptDownload &&
      event.type !== EventType.StyleDownload) ||
    (oldEvent.type !== EventType.ScriptDownload &&
      oldEvent.type !== EventType.StyleDownload)
  ) {
    return false;
  }

  return (
    event.type === oldEvent.type &&
    (event as ScriptDownloadEvent | StyleDownloadEvent).metadata.name ===
      (oldEvent as ScriptDownloadEvent | StyleDownloadEvent).metadata.name
  );
}

const MATCHES_CHECK_MAP = new Map<
  Event['type'],
  (newEvent: Event, oldEvent: Event) => boolean
>([
  // In Safari, we occasionally get the same "resource" event twice.
  // This check looks for a resource event with the same name, and replaces
  // it if found.
  [EventType.ScriptDownload, replaceResourceEvent],
  [EventType.StyleDownload, replaceResourceEvent],
]);

function defaultEqualityCheck({type}: Event, {type: otherType}: Event) {
  return type === otherType;
}

export class InflightNavigation {
  private timeOrigin: number;
  private start: number;
  private target: string;
  private events: Event[] = [];

  constructor(
    {
      timeOrigin,
      start = now(),
      target = window.location.pathname,
    }: NavigationStartOptions,
    private metadata: NavigationMetadata,
  ) {
    this.timeOrigin = timeOrigin;
    this.start = this.normalize(start);
    this.target = target;
  }

  event(
    event: Event,
    // Users can either force "matching" events to be replaced, or provide
    // a function that checks for an event that should be replaced. This may
    // be necessary if events can be triggered multiple times because of
    // browser inconsistencies.
    replaceExisting:
      | boolean
      | ((newEvent: Event, oldEvent: Event) => boolean) = false,
  ) {
    const normalizedEvent = {...event, start: this.normalize(event.start)};

    if (replaceExisting) {
      const check =
        typeof replaceExisting === 'function'
          ? replaceExisting
          : MATCHES_CHECK_MAP.get(event.type) || defaultEqualityCheck;

      const existingIndex = this.events.findIndex(oldEvent =>
        check(event, oldEvent),
      );

      if (existingIndex >= 0) {
        this.events.splice(existingIndex, 1, normalizedEvent);
      } else {
        this.events.push(normalizedEvent);
      }
    } else {
      this.events.push(normalizedEvent);
    }
  }

  cancel(timeStamp = now()) {
    return this.end(timeStamp, NavigationResult.Cancelled);
  }

  timeout(timeStamp = now()) {
    return this.end(timeStamp, NavigationResult.TimedOut);
  }

  finish(timeStamp = now()) {
    return this.end(timeStamp, NavigationResult.Finished);
  }

  private end(timeStamp: number, result: NavigationResult) {
    return new Navigation(
      {
        target: this.target,
        start: this.start,
        duration: this.normalize(timeStamp) - this.start,
        events: this.events.sort(
          (eventOne, eventTwo) => eventOne.start - eventTwo.start,
        ),
        result,
      },
      this.metadata,
    );
  }

  private normalize(timeStamp: number) {
    return this.timeOrigin + timeStamp;
  }
}
