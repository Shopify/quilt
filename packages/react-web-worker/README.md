# `@shopify/react-web-worker`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-web-worker.svg)](https://badge.fury.io/js/%40shopify%2Freact-web-worker.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-web-worker.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-web-worker.svg)

A hook for using web workers in React applications.

## Installation

```bash
$ yarn add @shopify/react-web-worker
```

## Usage

This package provides a `useWorker` hook to leverage web workers in React. For convenience, it also re-exports the entirety of [`@shopify/web-worker`](https://github.com/Shopify/quilt/tree/master/packages/web-worker), so you only need to install this package to get access to those additional exports.

### `useWorker()`

`useWorker` allows your React applications to take advantage of [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) provided by `createWorkerFactory` from `@shopify/web-worker`. This hook creates a web worker during render and terminates it when the component unmounts.

```tsx
import React, {useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {createWorkerFactory, useWorker} from '@shopify/react-web-worker';

// assume ./worker.ts contains
// export function hello(name) {
//  return `Hello, ${name}`;
// }

const createWorker = createWorkerFactory(() => import('./worker'));

function Home() {
  const worker = useWorker(createWorker);
  const [message, setMessage] = React.useState(null);

  useEffect(() => {
    (async () => {
      // Note: in your actual app code, make sure to check if Home
      // is still mounted before setting state asynchronously!
      const webWorkerMessage = await worker.hello('Tobi');
      setMessage(webWorkerMessage);
    })();
  }, [worker]);

  return <Page title="Home"> {message} </Page>;
}
```

You can optionally pass a second argument to `useWorker`, which will be used as the [options to the worker creator function](../web-worker#customizing-worker-creation).
