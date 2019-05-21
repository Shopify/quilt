# `@shopify/jest-dom-mocks`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks)

Jest mocking utilities for working with the DOM.

## Installation

```bash
$ yarn add @shopify/jest-dom-mocks
```

## Setup

This package provides two methods that should be included in the jest setup files:

- `ensureMocksReset`
- `installMockStorage`

### `ensureMocksReset`

Should be called in the `beforeEach` method of the jest `each-test` setup file. For example:

```ts
import {ensureMocksReset} from '@shopify/jest-dom-mocks';

beforeEach(() => {
  ensureMocksReset();
});
```

this will ensure that appropriate error messages are shown if a DOM object is mocked without beign restored for the next test.

### `installMockStorage`

Should be called in the jest `setup` file. For example:

```ts
import {installMockStorage} from '@shopify/jest-dom-mocks';

installMockStorage();
```

this will install the `localStorage` and `sessionStorage` mocks onto the global `window` object.

## Example Usage

In this example, we are testing a `NumberTransitioner` component using `Jest` and `Enzyme`. Note that parts of this file have been omitted in order to focus in on the relevant parts of the example.

```ts
import {clock, animationFrame} from '@shopify/jest-dom-mocks';

it('transitions to the next number after being updated', () => {
  clock.mock();
  animationFrame.mock();

  const duration = 1000;
  const rendered = mount(
    <NumberTransitioner duration={duration}>{100}</NumberTransitioner>,
  );
  rendered.setProps({children: 200});

  clock.tick(duration / 4);
  animationFrame.runFrame();
  expect(rendered.text()).toBe('125');

  clock.tick(duration / 2);
  animationFrame.runFrame();
  expect(rendered.text()).toBe('175');

  clock.restore();
  animationFrame.restore();
});
```

## API Reference

The mocks provided can be divided into 3 primary categories:

- standard mocks
- fetch mock
- storage mocks

### Standard Mocks

The following standard mocks are available:

- `animationFrame`
- `requestIdleCallback`
- `clock`
- `location`
- `matchMedia`
- `timer`
- `promise`
- `intersectionObserver`

Each of the standard mocks can be installed, for a given test, using `standardMock.mock()`, and must be restored before the end of the test using `standardMock.restore()`.

For example:

```ts
import {location} from '@shopify/jest-dom-mocks';

beforeEach(() => {
  location.mock();
});

afterEach(() => {
  location.restore();
});

it('does a thing', () => {
  // run test code here
});
```

Or, if you just need to mock something for a single test:

```ts
import {location} from '@shopify/jest-dom-mocks';

it('does a thing', () => {
  location.mock();

  // run test code here

  location.restore();
});
```

Some of the standard mocks include additional features:

#### `AnimationFrame.runFrame(): void`

Executes all queued animation callbacks.

#### `RequestIdleCallback.mockAsUnsupported(): void`

Removes `window.requestIdleCallback` and `window.cancelIdleCallback`, which can be useful for testing features that should work with and without idle callbacks available.

#### `RequestIdleCallback.runIdleCallbacks(timeRemaining?: number, didTimeout?: boolean): void`

Runs all currently-scheduled idle callbacks. If provided, `timeRemaining`/ `didTimeout` will be used to construct the argument for these callbacks. Once called, all callbacks are removed from the queue.

#### `RequestIdleCallback.cancelIdleCallbacks(): void`

Cancels all currently-scheduled idle callbacks.

#### `RequestIdleCallback.cancelIdleCallback(callback: any): void`

Cancels the idle callback specified by the passed argument. This value should be the one returned from a call to `window.requestIdleCallback`.

#### `Clock.mock(now: number | Date): void`

In addition to the usual `.mock()` functionality (with no arguments), the `Clock` object can be `mock`ed by passing in a `number` or `Date` object to use as the current system time.

#### `Clock.tick(time: number): void`

Ticks the mocked `Clock` ahead by `time` milliseconds.

#### `Clock.setTime(time: number): void`

Sets the system time to the given `time`.

#### `MatchMedia.mock(media?: MediaMatching): void`

In addition to the usual `.mock()` functionality (with no arguments), the `MatchMedia` object can be `mock`ed by passing in a `MediaMatching` function to use as the implementation.

The `MediaMatching` function has the following interface:

```ts
interface MediaMatching {
  (mediaQuery: string): Partial<MediaQueryList>;
}
```

it takes a `mediaQuery` string as input and returns a partial `MediaQueryList` to use as the result of `window.matchMedia(mediaQuery)`. The partial result will be merged with the default values:

```ts
{
  media: '',
  addListener: noop,
  removeListener: noop,
  matches: false
}
```

#### `MatchMedia.setMedia(media?: MediaMatching): void`

Sets the implementation function for the mocked `MatchMedia` object. see above (`MatchMedia.mock(media?: MediaMatching): void`) for details on how `MediaMatching` works.

You can also call `setMedia` with no arguments to restore the default implementation.

#### `Timer.runAllTimers(): void`

Runs all system timers to completion.

#### `Timer.runTimersToTime(time: number): void`

Runs all system timers to the given `time`.

#### `Promise.runPending(): void`

Runs all promise resolvers that have been queued.

#### `IntersectionObserver.observers`

Returns an array of records representing elements currently being observed with an `IntersectionObserver`. Each record contains a `target` (the element being observed), `callback` (the function used when constructing the observer), `options` (optional object used when constructing the observer), and a `source` (the fake `IntersectionObserver` instance that was used to observe).

#### `IntersectionObserver.simulate(entry: Partial<IntersectionObserverEntry> | Partial<IntersectionObserverEntry>[]): void`

Simulates a call on all matching observers. If you pass a `target` on the passed entry/ entries, only observers with a matching `target` element will be triggered. Otherwise, all observers will be triggered. If you do not provide a full `IntersectionObserverEntry` in any case, the missing fields will be filled out with sensible defaults.

### Fetch Mock

We use a version of `fetch-mock` that is augmented to ensure that it is properly unmocked after each test run. See the [API of `fetch-mock`](http://www.wheresrhys.co.uk/fetch-mock/api) for more details.

### Storage mock

The storage mocks are a bit different than the other mocks, because they serve primarily as a polyfill for the `localStorage` and `sessionStorage` APIs. The following standard API methods are implemented:

- `getItem`
- `setItem`
- `removeItrem`
- `clear`

Each of these are wrapped in a jest spy, which is automatically restored at the end of the test run.
