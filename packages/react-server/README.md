# `@shopify/react-server`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-server.svg)](https://badge.fury.io/js/%40shopify%2Freact-server.svg)

Utilities for adding React server-side rendering.

## Table of contents

1. [Installation](#installation)
1. [APO](#api)
1. [Node usage](#node-usage)
1. [Rails usage](#rails-usage)
   1. [`Deployment`](#deployment)

## Installation

```bash
$ yarn add @shopify/react-server
```

## API

### `createServer()`

### `createRender()`

## Node Usage

To begin using this package, Node apps only require a server entry point that calls the `createServer` function. At the minimum, this function requires a `render` function that renders the main `<App />` component.

```
import React from 'react';
import {createServer, RenderContext} from '@shopify/react-server';
import App from '../app';

const app = createServer({
  render: (ctx: RenderContext) => <App location={ctx.request.url} />
});
```

If you already have an exisiting node server, you can opt in to using only the render middleware provided by this package. See `createRender()`.

## Rails Usage

### Deployment

#### TBD

Shopify Only
Services DB
Shopify Build
Procfile
Secrets
Pod Config
Sewing-kit Config
Shipit
