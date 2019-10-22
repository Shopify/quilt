# `@shopify/koa-performance`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-performance.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-performance.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/koa-performance.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/koa-performance.svg)

A middleware which makes it easy to send metrics from your front end application and forward them to a stats-d server of your choice.

Best used with [`@shopify/performance`](https://www.npmjs.com/package/@shopify/performance) and/or [`@shopify/react-performance`](https://www.npmjs.com/package/@shopify/react-performance).

## Installation

```bash
$ yarn add @shopify/koa-performance
```

## Usage

### Basic server setup

First add the middleware to your Koa app. We recommend using `koa-mount` or `koa-router` to restrict it to a specific endpoint.

```tsx
// server.ts
import Koa from 'koa';
import mount from 'koa-mount';
import {clientPerformanceMetrics} from '@shopify/koa-performance';

const app = new Koa();

app.use(mount('/client-metrics', clientPerformanceMetrics({
  prefix: 'MyApp.',
  // when development is true the middleware will skip sending metrics
  development: process.env.NODE_ENV === 'development',
  // the host of the statsd server you want to send metrics to
  statsdHost: 'localhost',
  // the port of the statsd server you want to send metrics to
  statsdPort: 3000,
})));

app.listen(3000, () => {
  console.log('listening on port 3000');
})
```

Now the app will respond to requests to `/client-metrics`. The middleware returned from `clientPerformanceMetrics` expects to receive JSON POST requests meeting the following interface:

```tsx
interface Metrics {
  // the path the app was responding to when metrics were collected
  pathname: string;
  // data from `navigator.connection`
  connection: Partial<BrowserConnection>;
  // @shopify/performance lifecycle events
  events: LifecycleEvent[];
  // @shopify/performance navigation data
  navigations: {
    details: NavigationDefinition;
    metadata: NavigationMetadata;
  }[];
}
```

To confirm the endpoint is working we can make a CURL request. Run your server and paste this in your terminal.

```bash
curl 'http://localhost:3000/client-metrics' -H 'Content-Type: application/json' --data-binary '{"connection":{"onchange":null,"effectiveType":"4g","rtt":100,"downlink":1.75,"saveData":false},"events":[{"type":"ttfb","start":5631.300000008196,"duration":0},{"type":"ttfp","start":5895.370000012917,"duration":0},{"type":"ttfcp","start":5895.370000012917,"duration":0},{"type":"dcl","start":9874.819999997271,"duration":0},{"type":"load","start":10426.089999993565,"duration":0}],"navigations":[],"pathname":"/some-path"}' --compressed
```

You should get a `200` response back, and see console logs about metrics being skipped (since we are in development).

### Fullstack usage with `@shopify/react-performance`

> Todo

## API

> Todo
