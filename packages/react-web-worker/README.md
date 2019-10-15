# `@shopify/react-web-worker`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-web-worker.svg)](https://badge.fury.io/js/%40shopify%2Freact-web-worker.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-web-worker.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-web-worker.svg)

React hooks for using web workers

## Installation

```bash
$ yarn add @shopify/react-web-worker
```

## Usage

This package provides a `useWorker` hook to leverage web workers in React.

### Application

`useWorker` allows your React applications to take advantage of [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) provided by `createWorker`.

```tsx
import React, {useEffect} from 'react';
import {Page} from '@shopify/polaris';
import {createWorker, useWorker} from '@shopify/react-web-worker';

// assume ./worker.ts contains
// export function hello(name) {
//  return `Hello, ${name}`;
// }
const create = createWorker(() => import('./worker'));

function Home() {
  const worker = useWorker(create);
  const [message, setMessage] = React.useState(null);

  useEffect(
    () => {
      (async () => {
        const webWorkerMessage = await worker.hello('Tobi');
        setMessage(webWorkerMessage);
      })();
    },
    [worker],
  );

  return <Page title="Home"> {message} </Page>;
}
```

### `@shopify/web-worker`

This library re-exports the entirety of [`@shopify/web-worker`](https://github.com/Shopify/quilt/tree/master/packages/web-worker). These packages are distributed seperately to ensure that the [tooling](https://github.com/Shopify/quilt/tree/master/packages/web-worker#tooling) provided by `@shopify/web-worker` does not pull in `react` as a dependency.
