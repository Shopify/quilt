# `@shopify/react-idle`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-idle.svg)](https://badge.fury.io/js/%40shopify%2Freact-idle.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-idle.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-idle.svg)

Utilities for working with [idle callbacks](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) in React.

## Installation

```bash
$ yarn add @shopify/react-idle
```

## Usage

This library provides a hook (`useIdleCallback`) and a component (`OnIdle`) for registering a callback to run in the next idle callback.

> Note: this callback is not called with any arguments, unlike direct usage of `requestIdleCallback`. This makes it more suited for use with discrete operations, rather than ones that will need to schedule themselves for subsequent idle callbacks if the work has not been completed.

```tsx
import {useCallback} from 'react';
import {useIdleCallback, OnIdle} from '@shopify/react-idle';

function MyComponent() {
  const callback = useCallback(() => {
    console.log('Hello from an idle callback!');
  }, []);

  useIdleCallback(callback);

  // or

  return <OnIdle perform={callback} />;
}
```

If the callback ever changes, or the component unmounts, the original callback will not be run.

### `UnsupportedBehavior`

Because not every browser supports idle callbacks, this library allows you to specify the behavior of `perform` when `requestIdleCallback` is not present. There are currently two options (each of which can be passed as an `unsupportedBehavior` option for the hook, or an `unsupportedBehavior` prop of the component):

- `UnsupportedBehavior.AnimationFrame` (default): run the callback in the next animation frame using `requestAnimationFrame`.
- `UnsupportedBehavior.Immediate`: run the callback immediately on mount.

```tsx
import {useIdleCallback, UnsupportedBehavior} from '@shopify/react-idle';

function MyComponent() {
  useIdleCallback(doSomethingThatCanBeDeferred, {
    unsupportedBehavior: UnsupportedBehavior.Immediate,
  });

  return null;
}
```

### Additional types

Because the typings for `requestIdleCallback` are not yet provided by the TypeScript standard library, this module also exports a number of types that are needed to interact with these globals.
