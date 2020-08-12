# `@shopify/react-server`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-server.svg)](https://badge.fury.io/js/%40shopify%2Freact-server.svg)

A simple library for React server-side rendering using [`@shopify/react-html`](https://github.com/Shopify/quilt/tree/master/packages/react-html).

## Table of contents

1. [Installation](#installation)
1. [Node usage](#node-usage)
1. [Rails usage](#rails-usage)
   1. [Deployment](#deployment)
1. [Webpack plugin](#webpack-plugin)
1. [API](#api)

## Installation

```bash
$ yarn add @shopify/react-server
```

## Rails Usage

We provide a [gem](https://github.com/Shopify/quilt/blob/master/gems/quilt_rails/README.md#L2) to automagically setup a proxy controller for react-server.

## Node Usage

Node apps require a server entry point that calls the `createServer` function. At the minimum, this function requires a `render` function that renders the main `<App />` component.

```tsx
import React from 'react';
import {createServer} from '@shopify/react-server';
import {Context} from 'koa';
import App from '../app';

const app = createServer({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8081,
  ip: process.env.IP,
  assetPrefix: process.env.CDN_URL || 'localhost:8080/assets/webpack',
  render: (ctx: Context) => {
    const whatever = /* do something special with the koa context */;
    // any special data we add to the incoming request in our rails controller we can access here to pass into our component
    return <App server location={ctx.request.url} someCustomProp={whatever}  />;
  },
});
export default app;
```

If you already have an existing node server, you can opt in to using only the render middleware provided by this package. See `createRender()`.

## Webpack Plugin

We also provide a [webpack plugin](./docs/webpack-plugin.md) to automatically generate the server and client entries for an application.

### Deployment (Shopify specific)

For Shopifolk, we have a [walkthrough](https://platform-docs.docs.shopify.io/getting_started/rails-with-a-private-node-server.html) for getting an app ready to deploy.

## API

### `createServer()`

Creates a full `Koa` server which renders an `@shopify/react-html` application.

```tsx
import {createServer} from '@shopify/react-server';
```

The `createServer` function takes an `Options` object of the following interface.

```tsx
interface Options {
  // the port to bind
  port?: number;
  // the ip to run the application on
  ip?: string;
  // the full base url for the cdn if applicable
  assetPrefix?: string;
  // the name of the asset on the cdn, or a function of Koa.Context to a name
  assetName?: string | (ctx: Context) => string;
  // any additional Koa middleware to mount on the server
  serverMiddleware?: compose.Middleware<Context>[];
  // a function of `(ctx: Context, data: {locale: string}): React.ReactElement<any>`
  render: RenderFunction;
  // whether to run in debug mode
  debug?: boolean;
  // a function similar to the render option but specifically used to render error pages for production SSR errors
  renderError: RenderFunction;
}
```

It returns a running [Koa](https://github.com/koajs/koa/) server.

### `createRender()`

Creates a Koa middleware which renders an `@shopify/react-html` application.

```tsx
import {createRender} from '@shopify/react-server';
```

The `createRender` function takes two arguments. The first is a render function that should return the main component at the top of the application tree in JSX. This function receives the full [Koa](https://github.com/koajs/koa/) server context which can be used to derive any necessary props to feed into the main component.

The second argument is a subset of [`@shopify/react-effect#extract`](../react-effect/README.md#extract)'s options which are simply delegated to the `extract` call within the `createRender` middleware.

#### Options

- `afterEachPass?(pass: Pass): any` see [`@shopify/react-effect#extract`](../react-effect/README.md#extract)

- `betweenEachPass?(pass: Pass): any` see [`@shopify/react-effect#extract`](../react-effect/README.md#extract)

It returns a [Koa](https://github.com/koajs/koa/) middleware.
