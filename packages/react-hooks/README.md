# `@shopify/react-hooks`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-hooks.svg)](https://badge.fury.io/js/%40shopify%2Freact-hooks.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-hooks.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-hooks.svg)

A collection of primitive React hooks.

## Installation

```bash
yarn add @shopify/react-hooks
```

## List of hooks

- [useDebouncedValue()](#usedebouncedvalue)
- [useDelayedCallback()](#usedelayedcallback)
- [useForceUpdate()](#useforceupdate)
- [useInterval()](#useinterval)
- [useIsomorphicLayoutEffect()](#useisomorphiclayouteffect)
- [useLazyRef()](#uselazyref)
- [useMedia() & useMediaLayout()](#usemedia--usemedialayout)
- [useMountedRef()](#usemountedref)
- [useOnValueChange()](#useonvaluechange)
- [usePrevious()](#useprevious)
- [useTimeout()](#usetimeout)
- [useToggle()](#usetoggle)

## Usage

### `useDebouncedValue()`

This hook provides a debounced value.

```tsx
function MyComponent() {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue);
  const {data, loading} = useQuery(SomeQuery, {
    variables: {
      query: debouncedSearch,
    },
  });

  function handleSearchTextChange(evt: React.KeyboardEvent) {
    setSearchValue(evt.currentTarget.value);
  }

  return <input onChange={handleSearchTextChange} />;
}
```

### `useDelayedCallback()`

This hook provides a delayed callback function. It takes a callback and a delay in milliseconds. This might be useful when you want to invoke a callback after a certain delay.

```tsx
function MyComponent() {
  const delay = 300;
  const callback = () => {
    console.log(
      `Oh, you KNOW I'm calling that callback after ${delay} milliseconds!`,
    );
  };

  const callbackWithDelay = useDelayedCallback(callback, delay);

  const onClick = () => {
    callbackWithDelay();
  };

  return <button onClick={onClick}>Click me!</button>;
}
```

### `useForceUpdate()`

This hook provides a `forceUpdate` function which will force a component to re-render. This might be useful when you want to re-render after a mutable object gets updated.

```tsx
const mutableObject = {foo: 'bar'};
export default function ResourceListFiltersExample() {
  const forceUpdate = useForceUpdate();
  const onClick = () => {
    mutableObject.foo = 'bar' + new Date().getTime();
    forceUpdate();
  };

  return <button onClick={onClick}>Click Me</button>;
}
```

### `useOnValueChange()`

This hook tracks a given value and invokes a callback when it has changed.

```tsx
function MyComponent({foo}: {foo: string}) {
  useOnValueChange(foo, (newValue, oldValue) => {
    console.log(`foo changed from ${oldValue} to ${newValue}`);
  });

  return null;
}
```

### `useTimeout()`

This hook provides a declarative version of [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout). The first argument is a callback that will be invoked after the given delay (number of milliseconds) as the second argument. Optionally, the timeout can be disabled by passing `null` as the delay.

```tsx
function MyComponent() {
  const [status, setStatus] = React.useState('Pending');
  const pending = status === 'Pending';

  const buttonLabel = pending ? 'Cancel' : 'Reset';
  const handleClick = () => setStatus(pending ? 'Cancelled' : 'Pending');
  const delay = pending ? 1000 : null;

  useTimeout(() => setStatus('Fired'), delay);

  return (
    <div>
      <div>{status}</div>
      <button onClick={handleClick}>{buttonLabel}</button>
    </div>
  );
}
```

### `useInterval()`

This hook provides a declarative version of [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval). The first argument is a callback that will be invoked successively after the given delay (number of milliseconds) as the second argument. Optionally, the interval can be disabled by passing `null` as the delay.

```tsx
function MyComponent() {
  const [counter, setCounter] = React.useState(0);
  const [enabled, setEnabled] = React.useState(true);

  const delay = enabled ? 1000 : null;
  const label = enabled ? 'Disable' : 'Enable';
  const toggle = () => setEnabled(!enabled);

  useInterval(() => setCounter(counter + 1), delay);

  return (
    <div>
      <div>{counter}</div>
      <button onClick={toggle}>{label}</button>
    </div>
  );
}
```

This is a TypeScript implementation of @gaeron's `useInterval` hook from the [Overreacted blog post](https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code).

### `useIsomorphicLayoutEffect()`

This hook is a drop-in replacement for `useLayoutEffect` that can be used safely in a server-side rendered app. It resolves to `useEffect` on the server and `useLayoutEffect` on the client (since `useLayoutEffect` cannot be used in a server-side environment).

Refer to the [`useLayoutEffect` documentation to learn more](https://reactjs.org/docs/hooks-reference.html#uselayouteffect).

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

### `useMedia()` & `useMediaLayout()`

This hook listens to a [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) created via [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) and returns true or false if it matches the media query string.

`useMediaLayout` is similar to `useMedia` but it uses `useLayoutEffect` internally to re-render synchronously.

```tsx
function MyComponent() {
  const isSmallScreen = useMedia('(max-width: 640px)');
  return (
    <p>
      {isSmallScreen ? 'This is a small screen' : 'This is not a small screen'}
    </p>
  );
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

This hook stores the previous value of a given variable.

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

This hook provides an object that contains a boolean state value and a set of memoised callbacks to toggle it, force it to true, and force it to false. It accepts one argument that is the initial value of the state or an initializer function returning the initial value. This is useful for toggling the active state of modals and popovers.

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
