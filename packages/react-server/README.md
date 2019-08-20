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

## Node Usage

To begin using this package, Node apps only require a server entry point that calls the `createServer` function. At the minimum, this function requires a `render` function that renders the main `<App />` component.

```tsx
import React from 'react';
import {createServer, RenderContext} from '@shopify/react-server';
import App from '../app';

const app = createServer({
  render: (ctx: RenderContext) => <App location={ctx.request.url} />,
});
```

If you already have an exisiting node server, you can opt in to using only the render middleware provided by this package. See `createRender()`.

## Rails Usage

We provide a [gem](https://github.com/Shopify/quilt/blob/master/gems/quilt_rails/README.md#L2) to automagically setup a proxy controller for to react-server.

### Deployment (Shopify specific)

For Shopifolk, we have a [walkthrough](https://docs.shopifycloud.com/getting_started/rails-with-node-walkthrough) for getting an app ready to deploy.

## Webpack Plugin

We provide a [webpack plugin](https://github.com/Shopify/quilt/tree/flesh-out-quilt_rails-readme/packages/react-server-webpack-plugin) to automatically generate entrypoints using this package.

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
  // any additional Koa middleware to mount on the server
  serverMiddleware?: compose.Middleware<Context>[];
  // a function of `(ctx: Koa.Context) => React.ReactNode`
  render: RenderFunction;
  // whether to run in debug mode
  debug?: boolean;
}
```

It returns a running [Koa](https://github.com/koajs/koa/) server.

### `createRender()`

Creates a Koa middleware which renders an `@shopify/react-html` application.

```tsx
import {createRender} from '@shopify/react-server';
```

The `createRender` function takes a subset of the `Options` object used by `createServer`.

```tsx
interface Options {
  port?: number;
  ip?: string;
  assetPrefix?: string;
  debug?: boolean;
  render: RenderFunction;
}
```

It returns a [Koa](https://github.com/koajs/koa/) middleware.
