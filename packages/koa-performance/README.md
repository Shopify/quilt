# `@shopify/koa-performance`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-performance.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-performance.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/koa-performance.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/koa-performance.svg)

Middleware which makes it easy to send metrics from your front-end application and forward them to a StatsD server of your choice.

Best used with [`@shopify/performance`](https://www.npmjs.com/package/@shopify/performance) and/or [`@shopify/react-performance`](https://www.npmjs.com/package/@shopify/react-performance).

## Table of Contents

- [Quick-start](#quick-start)

  - [Install the package](#install-the-package)
  - [Add the middleware](#add-the-middleware)
  - [Verify with CURL](#verify-with-curl)
  - [Send data from the frontend](#send-data-from-the-frontend)
  - [Process report data and forward it to StatsD](#process-report-data-and-forward-it-to-statsd)

- [API](#api)

## Quick-start

### Install the package

First we will need to install the npm package.

```bash
$ yarn add @shopify/koa-performance
```

### Add the middleware

Next we import the `clientPerformanceMetrics` factory into our server, use it to create a middleware to collect performance data, and mount it. We use something `koa-mount` to restrict it to a specific endpoint. If your application uses `koa-router`, you can use that instead.

```tsx
// server.ts
import Koa from 'koa';
import mount from 'koa-mount';
import {clientPerformanceMetrics} from '@shopify/koa-performance';

// create our Koa instance for the server
const app = new Koa();

app.use(
  mount(
    '/client-metrics',
    clientPerformanceMetrics({
      // the prefix for metrics sent to StatsD
      prefix: 'ExampleCode.',
      // the host of the statsd server you want to send metrics to
      statsdHost: 'YOUR STATSD HOST HERE'
      // the port of the statsd server you want to send metrics to
      statsdPort: 3000,
    }),
  ),
);

// other middleware for your app
// ...

app.listen(3000, () => {
  console.log('listening on port 3000');
});
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
  // the user's locale (e.g., `en-CA`)
  locale?: string;
  // @shopify/performance navigation data
  navigations: {
    details: NavigationDefinition;
    metadata: NavigationMetadata;
  }[];
}
```

### Verify with CURL

To confirm the endpoint is working we can make a CURL request. Run your server and paste this in your terminal.

```bash
curl 'http://localhost:3000/client-metrics' -H 'Content-Type: application/json' --data-binary '{"connection":{"onchange":null,"effectiveType":"4g","rtt":100,"downlink":1.75,"saveData":false},"events":[{"type":"ttfb","start":5631.300000008196,"duration":0},{"type":"ttfp","start":5895.370000012917,"duration":0},{"type":"ttfcp","start":5895.370000012917,"duration":0},{"type":"dcl","start":9874.819999997271,"duration":0},{"type":"load","start":10426.089999993565,"duration":0}],"navigations":[],"pathname":"/some-path"}' --compressed
```

You should get a `200` response back, and see console logs about metrics being skipped (since we are in development).

#### Send data from the frontend

We have verified that our middleware is setup correctly and ready to recieve reports. However, it is only useful if we send it real data from a our frontend code.

React applications can use components from `@shopify/react-performance` to collect and send metrics to the server in the right format. Check out [`@shopify/react-performance`'s README](../react-performance/README.md) for details.

Non-React applications must use [`@shopify/performance`](../performance/README.md) directly and setup their own performance reports with it's API.

## API

### clientPerformanceMetrics

A middleware factory which returns a Koa middleware for parsing and sanitizing performance reports sent as JSON, and sending them to a StatsD server.

It takes options conforming to the following interface:

```ts
interface Options {
  // the prefix for metrics sent to StatsD
  prefix: string;
  // whether the app is being run in development mode.
  development?: boolean;
  // the host of the statsd server you want to send metrics to
  statsdHost?: string;
  // the port of the statsd server you want to send metrics to
  statsdPort?: number;
  // threshold in milliseconds to skip metrics
  anomalousNavigationDurationThreshold?: number;
  // instance to use to log metrics
  logger?: Logger;
  // a function to use to customize the tags to be sent with all metrics
  additionalTags?(
    metricsBody: Metrics,
    userAgent: string,
  ): {[key: string]: string | number | boolean};
  // a function to use to customize the tags to be sent with navigation metrics
  additionalNavigationTags?(
    navigation: Navigation,
  ): {[key: string]: string | number | boolean};
  // a function to use to send extra metrics for each navigation
  additionalNavigationMetrics?(
    navigation: Navigation,
  ): {name: string; value: any}[];
}
```

### Examples

#### Basic

The simplest use of the middleware factory passes only the connection information for an application's StatsD server, and the `prefix`.

```ts
  const middleware = clientPerformanceMetrics({,
    prefix: 'ExampleCode.',
    statsdHost: process.env.STATSD_HOST,
    statsdPort: process.env.STATSD_PORT,
  });
```

#### Extra tags

Often, applications will want to categorize distribution data using custom tags. The `additionalTags` and `additionalNavigationTags` allow custom tags to be derived from the data sent to the middleware. The tags will then be attached to outgoing StatsD distribution calls.

```ts
  const middleware = clientPerformanceMetrics({,
    prefix: 'ExampleCode.',
    statsdHost: process.env.STATSD_HOST,
    statsdPort: process.env.STATSD_PORT,
    additionalNavigationTags: (navigation) => ({navigationTarget: navigation.target}),
    additionalTags: (metricsBody) => ({rtt: metricsBody.connection.rtt}),
  });
```

#### Extra metrics

Applications also commonly need to send custom distribution data. The `additionalNavigationMetrics` option allow custom metrics to be derived from the data sent to the middleware. These will then be sent using `StatsD`'s `distribution` method.

```ts
  const middleware = clientPerformanceMetrics({,
    prefix: 'ExampleCode.',
    statsdHost: process.env.STATSD_HOST,
    statsdPort: process.env.STATSD_PORT,
    additionalNavigationMetrics: ({events}) => {
      const weight = navigation.events
        .filter((event) => event.size != null)
        .reduce((total, event) => {
          total + event.size
        }, 0);

      return [{
        name: 'navigationTotalResourceWeight',
        value: weight
      }];
    },
  });
```
