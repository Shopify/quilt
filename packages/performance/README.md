# `@shopify/performance`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fperformance.svg)](https://badge.fury.io/js/%40shopify%2Fperformance.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/performance.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/performance.svg)

Primitives for collecting browser performance metrics.

## Installation

```bash
$ yarn add @shopify/performance
```

## Usage

This library wraps around the native `Performance` and `PerformanceObserver` browser globals, providing a normalized interface for tracking performance across browsers. It also adds the notion of "navigations": sections of time spent navigating to a "complete" page, during which events (time to first byte, script downloads, GraphQL queries, etc) occur. Finally, it provides a few event listeners to be informed of new navigation and key events.

### `Performance`

To start using this library, construct an instance of the `Performance` class. Only one instance of this class should exist during the lifecycle of your app, as this class assumes it is constructed near the page’s initial load.

```ts
import {Performance} from '@shopify/performance';

const performance = new Performance();
```

If you want to listen for events, you can use the `on` method. There are three events you can listen for:

```ts
// Listen for completed navigations. If you call this after the initial load
// "navigation", your handler will immediately be invoked with that object.
performance.on('navigation', (navigation) => {});

// Listen for the start of new navigations.
performance.on('inflightNavigation', () => {});

// Listen for "lifecycle" events; that is, those that are part of the initial
// page load and come directly from the browser. These are events like time
// to first byte and time to first paint. See the `LifecycleEvent` type for
// the full set of possible events. If you add your listener after some of these
// events have been triggered, it will immediately be invoked once for each
// previously-triggered event.
performance.on('lifecycleEvent', (event) => {});
```

The `on` method returns a clean-up function that you can invoke when you're done listening on the event:

```ts
const cleanupNavigationListener = performance.on(
  'navigation',
  (navigation) => {},
);

cleanupNavigationListener();
```

You can also manage navigations using this object. Calling `performance.start()` will begin a new navigation, cancelling any that are currently inflight. `performance.event()` allows you to register custom events on the navigation. Finally, `performance.finish()` marks the navigation is complete.

```ts
import {now} from '@shopify/performance';

// You usually don't need this, as we automatically start a visit when the
// browser first loads, and when the history API is used to navigate the app.
performance.start({
  target: '/my-page',
});

// A duration of 0 indicates a mark of some kind, while a non-0 duration would
// be used for things like network requests. Make sure to use the `now()` function
// because it will use high-resolution time when available.
performance.event({
  type: 'customevent',
  start: now(),
  duration: 0,
});

performance.finish();
```

### `Navigation`

The `Navigation` object represents a full navigation, either from a full-page refresh, or between two pages. It has the following key details about the navigation:

- `start`: the full timestamp when the navigation started, using high-resolution time when available.
- `duration`: how long the navigation took, using high-resolution time when available.
- `target`: a string representing the "end" of the navigation, defaulting to the target page’s pathname.
- `result`: a `NavigationResult` marking the navigation as either finished, cancelled (another navigation began before this one completed), or timed out (`performance.finish()` was not called in a reasonable amount of time, which defaults to 60 seconds from when `performance.start()` is called)
- `metadata`: an object giving additional context to the navigation. This object has the following properties:
  - `index` (the number of navigations before this one since the last full page navigation)
  - `supportsDetailedEvents` (whether events like time to first paint are supported by the browser)
  - `supportsDetailedTime` (whether high-resolution time is supported by the browser)
- `events`: an array of objects representing the events that occurred during the navigation. These events include the following properties:
  - `type`: the type of event
  - `start`: when the event started, _relative to the start of the navigation_
  - `duration`: how long the event took (0 indicates a mark, rather than an event occurring over time)
  - `metadata`: an object with arbitrary key-value pairs providing additional context

`Navigation` also provides a number of utility methods for gathering more actionable information, such as `eventsByType` for filtering events to a particular type, or `totalDownloadSize` for the cumulative size of all requested resources. Please consult the TypeScript definitions for a full listing of these methods.

### Events

The `Performance` and `Navigation` classes both deal with `Event` objects with which contain information about the timing of specific milestones during the course of a user's browser session in milliseconds.

#### Lifecycle Events

##### Time to First Byte (`EventType.TimeToFirstByte`)

The time until the server sends the first part of the response.
Learn more about [time to First Byte](https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing).

##### First Paint (`EventType.TimeToFirstPaint`)

The time until the browser renders anything that differs from the previous page.
Learn more about [first paint](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint).

##### First Contentful Paint (`EventType.TimeToFirstContentfulPaint`)

The time until the browser renders the first bit of content from the DOM.
Learn more about this [first Contentful Paint](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint).

##### DOM Content Loaded (`EventType.DomContentLoaded`)

The time until the DOM has been entirely loaded and parsed.
Learn more about [DOM Content Loaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded).

##### First Input Delay (`EventType.FirstInputDelay`)

The time from when a user first interacts with your site to the time when the browser is able to respond to that interaction.
Learn more about [first Input Delay](https://developers.google.com/web/updates/2018/05/first-input-delay).

##### Load Event (`EventType.Load`)

The time until the DOM and all its styles and synchronous scripts have loaded.
Learn more about [load Event](https://developer.mozilla.org/en-US/docs/Web/Events/load).

#### Navigation Events

##### Long Task (`EventType.LongTask`)

Any task that take 50 milliseconds or more.
Learn more about [long task](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming).

##### Script Download Event (`EventType.ScriptDownload`)

The time spent downloading a script resource.

This event will also log the name and size of the resource as `metadata`.

##### Style Download Event (`EventType.StyleDownload`)

The time spent downloading a style resource.

This event will also log the name and size of the resource as `metadata`.

##### GraphQL Event (`EventType.GraphQL`)

The time spent resolving GraphQL queries during the navigation.

This metric needs to be manually set up in Apollo Client.
The setup can be done as a [ApolloLink](https://www.apollographql.com/docs/link/).

##### Usable Event (`EventType.Usable`)

The time between navigation start and the first time a [`@shopify/react-performance`](../../react-performance)'s `<PerformanceMark stage="usable" />` component is rendered.
