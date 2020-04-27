export enum EventType {
  TimeToFirstByte = 'ttfb',
  TimeToFirstPaint = 'ttfp',
  TimeToFirstContentfulPaint = 'ttfcp',
  DomContentLoaded = 'dcl',
  FirstInputDelay = 'fid',
  Load = 'load',
  LongTask = 'longtask',
  Usable = 'usable',
  // eslint-disable-next-line @shopify/typescript/prefer-pascal-case-enums
  GraphQL = 'graphql',
  ScriptDownload = 'script',
  StyleDownload = 'style',
}

interface BasicEvent {
  start: number;
  duration: number;
  metadata?: {[key: string]: any};
}

export interface TimeToFirstByteEvent extends BasicEvent {
  type: EventType.TimeToFirstByte;
  metadata?: undefined;
}

export interface TimeToFirstPaintEvent extends BasicEvent {
  type: EventType.TimeToFirstPaint;
  metadata?: undefined;
}

export interface TimeToFirstContentfulPaintEvent extends BasicEvent {
  type: EventType.TimeToFirstContentfulPaint;
  metadata?: undefined;
}

export interface DomContentLoadedEvent extends BasicEvent {
  type: EventType.DomContentLoaded;
  metadata?: undefined;
}

export interface FirstInputDelayEvent extends BasicEvent {
  type: EventType.FirstInputDelay;
  metadata?: undefined;
}

export interface LoadEvent extends BasicEvent {
  type: EventType.Load;
  metadata?: undefined;
}

export interface LongTaskEvent extends BasicEvent {
  type: EventType.LongTask;
  metadata?: undefined;
}

export interface ScriptDownloadEvent extends BasicEvent {
  type: EventType.ScriptDownload;
  metadata: {name: string; size?: number};
}

export interface StyleDownloadEvent extends BasicEvent {
  type: EventType.StyleDownload;
  metadata: {name: string; size?: number};
}

export interface GraphQLEvent extends BasicEvent {
  type: EventType.GraphQL;
  metadata: {name: string; size?: number};
}

export interface UsableEvent extends BasicEvent {
  type: EventType.Usable;
  metadata?: undefined;
}

export interface CustomEvent extends BasicEvent {
  type: string;
}

export type LifecycleEvent =
  | TimeToFirstByteEvent
  | TimeToFirstPaintEvent
  | TimeToFirstContentfulPaintEvent
  | DomContentLoadedEvent
  | FirstInputDelayEvent
  | LoadEvent;

export type Event =
  | LifecycleEvent
  | LongTaskEvent
  | ScriptDownloadEvent
  | StyleDownloadEvent
  | GraphQLEvent
  | UsableEvent
  | CustomEvent;

export interface EventMap {
  [EventType.TimeToFirstByte]: TimeToFirstByteEvent;
  [EventType.TimeToFirstPaint]: TimeToFirstPaintEvent;
  [EventType.TimeToFirstContentfulPaint]: TimeToFirstContentfulPaintEvent;
  [EventType.DomContentLoaded]: DomContentLoadedEvent;
  [EventType.FirstInputDelay]: FirstInputDelayEvent;
  [EventType.Load]: LoadEvent;
  [EventType.ScriptDownload]: ScriptDownloadEvent;
  [EventType.StyleDownload]: StyleDownloadEvent;
  [EventType.GraphQL]: GraphQLEvent;
  [EventType.LongTask]: LongTaskEvent;
  [EventType.Usable]: UsableEvent;
  [key: string]: CustomEvent;
}

export interface NavigationMetadata {
  index: number;
  supportsDetailedTime: boolean;
  supportsDetailedEvents: boolean;
}

export interface NavigationDefinition {
  start: number;
  duration: number;
  target: string;
  events: Event[];
  result: NavigationResult;
}

export enum NavigationResult {
  Finished,
  TimedOut,
  Cancelled,
}
