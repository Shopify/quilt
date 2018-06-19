# `@shopify/async-chunks`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fasync-chunks.svg)](https://badge.fury.io/js/%40shopify%2Fasync-chunks.svg)

A code splitting & server side rendering solution for universal react apps inspired by [react-loadable](https://github.com/jamiebuilds/react-loadable).

This package provides all the tools required to get your app code splitting & server side rendering in harmony:

- Webpack plugin and Babel plugin

- An HOC to generate asynchrously loadable chunks

- Koa middleware

- Initializers to preload chunks on the server & client

## Installation

```bash
$ yarn add @shopify/async-chunks
```

## Usage

### Creating async chunks in your app

`@shopify/async-chunks` provides a HOC that returns a code split component that can then be SSR rendered.

```js
// app/sections/Main

import AsyncChunk from '@shopify/async-chunks';
import MainSkeleton from './components/MainSkeleton';

const Main = AsyncChunk({
  loader: () => import(/* webpackChunkName: 'main' */ './Main'),
  loading: MainSkeleton,
});

class MyComponent extends React.Compoennt {
  render() {
    return <SomeCompoennt />;
  }
}
```

### Server setup

`@shopify/async-chunks` provides a Koa middleware which provides an api to interact with the manifest

```
// server/middleware/async-chunks

import {middleware} from '@shopify/async-chunks/dist/server';
import {resolve} from 'path';

const manifest = resolve(__dirname, '../../build/client/async-chunks.json');
export default middleware({manifest});


// server/server.ts

import Koa from 'koa';
import asyncChunksMiddleware from './middleware/async-chunks';

const app = new Koa();
app.use(asyncChunksMiddleware);
```

Once the Koa middleware is configured, we can then setup our universal react app renderer to SSR our async chunks
