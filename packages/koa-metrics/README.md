# `@shopify/koa-metrics`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-metrics.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-metrics.svg)

Opinionated performance metric tracking for Koa, implemented with DogStatsD.

## Installation

```bash
$ yarn add @shopify/koa-metrics
```

## Usage

```javascript
import Koa from 'koa';
import metrics from '@shopify/koa-metrics';

const app = new Koa();

app.use(
  metrics({
    prefix: 'AppName',
    host: 'some-statsd-host.com:8125',
  }),
);
```

### Options

The passed in `options` object adheres to the following API:

#### `prefix` (required)

The global StatsD metric name prefix; should be provided in `PascalCase`.

#### `host` (required)

The url for the StatsD host; should be provided in the format: `hostname:port`.

## API

An instance of the `Metrics` object will be available on `ctx.metrics` further down in the middleware stack.

### `Metrics`

#### `.distribution(name: string, value: number, sampleRate?: number, tags?: Tags)`

Sends a distribution command with the specified `value` in milliseconds.

#### `.initTimer(): Timer`

Returns a new `Timer` started at the current `process.hrtime()`

### `Timer`

#### `.stop(): number`

Returns the time, in milliseconds, since the `Timer` was created.

### `Tags`

tags are an object keyed by the name of the corresponding tag. For example:

```
{
  name: value,
  name2: value2
}
```

## Intelligent Defaults

The global metric name prefix is provided through the [options object](#options).

This package automatically provides performance metrics for HTTP requests.

### Standard tags

- `path`
- `request_method`
- `response_code`
- `response_type` (eg. `2xx`, `3xx`, ...)

### Default Metrics

#### `request_time`

Time to complete a request, from the application perspective.

#### `request_queuing_time`

Time before a request actually started being processed.

This metric is emitted when the application start processing a request. It relies on the presence of a header `X-Request-Start` set by the first HTTP hop.

#### `request_content_length`

This metric is based on the response header `Content-Length`. Some responses don't provide this header (chunked encoding); in those cases, this will not be reported.
