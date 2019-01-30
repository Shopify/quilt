# `@shopify/performance`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
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
performance.on('navigation', navigation => {});

// Listen for the start of new navigations.
performance.on('navigationStart', () => {});

// Listen for "lifecycle" events; that is, those that are part of the initial
// page load and come directly from the browser. These are events like time
// to first byte and time to first paint. See the `LifecycleEvent` type for
// the full set of possible events. If you add your listener after some of these
// events have been triggered, it will immediately be invoked once for each
// previously-triggered event.
performance.on('lifecycleEvent', event => {});
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
