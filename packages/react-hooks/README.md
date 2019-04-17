# `@shopify/react-hooks`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-hooks.svg)](https://badge.fury.io/js/%40shopify%2Freact-hooks.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-hooks.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-hooks.svg)

A collection of primitive React hooks.

## Installation

```bash
$ yarn add @shopify/react-hooks
```

## Usage

### `useOnValueChange()`

This hook will track a given value and invoke a callback when it has changed.

```tsx
function MyComponent({foo}: {foo: string}) {
  useOnValueChange(foo, (newValue, oldValue) => {
    console.log(`foo changed from ${oldValue} to ${newValue}`);
  });

  return null;
}
```

### `useTimeout()`

This hook provides a declarative version of [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout). The first argument is a callback that will be invoked after the given delay (number of milliseconds) as the second argument.

```tsx
function MyComponent() {
  const [foo, setFoo] = React.useState('Bar');

  useTimeout(() => setFoo('Baz!'), 5000);

  return <div>{foo}</div>;
}
```

### `useLazyRef()`

This hook creates a ref object like React’s `useRef`, but instead of providing it the value directly, you provide a function that returns the value. The first time the hook is run, it will call the function and use the returned value as the initial `ref.current` value. Afterwards, the function is never invoked. You can use this for creating refs to values that are expensive to initialize.

```tsx
function MyComponent() {
  const ref = useLazyRef(() => someExpensiveOperation());

  React.useEffect(() => {
    console.log('Initialized expensive ref', ref.current);
  });

  return null;
}
```
