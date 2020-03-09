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

### `useMountedRef()`

This hook keeps track of a component's mounted / un-mounted status and returns a ref object like React’s [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) with a boolean value representing said status. This is often used when a component contains an async task that sets state after the task has resolved.

```tsx
import React from 'react';
import {useMountedRef} from '@shopify/react-hooks';

function MockComponent() {
  const [result, setResult] = React.useState();
  const mounted = useMountedRef();

  async function handleOnClick() {
    const result = await fetchData();

    if (mounted.current) {
      setData(result);
    }
  }

  return (
    <button onClick={handleOnClick} type="button">
      Fetch Data
    </button>
  );
}
```

### `usePrevious()`

This hook will store the previous value of a given variable.

```tsx
function Score({value}) {
  const previousValue = usePrevious(value);
  const newRecord = value > previousValue ? <p>We have a new record!</p> : null;

  return (
    <>
      <p>Current score: {value}</p>
      {newRecord}
    </>
  );
}
```

### `useToggle()`

This hook will provide an object that contains a boolean state value and a set of memoised callbacks to toggle it, force it to true and force it to false. It accepts one argument that is the initial value of the state. This is useful for toggling the active state of modals and popovers.

```tsx
function MyComponent() {
  const {
    value: isActive,
    toggle: toggleIsActive,
    setTrue: setIsActiveTrue,
    setFalse: setIsActiveFalse,
  } = useToggle(false);
  const activeText = isActive ? 'true' : 'false';

  return (
    <>
      <p>Value: {activeText}</p>
      <button onClick={toggleIsActive}>Toggle isActive state</button>
      <button onClick={setIsActiveTrue}>Set isActive state to true</button>
      <button onClick={setIsActiveFalse}>Set isActive state to false</button>
    </>
  );
}
```
