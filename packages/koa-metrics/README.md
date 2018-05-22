# `@shopify/koa-metrics`

Opinionated performance metric tracking for Koa, implemented with DogStatsD

## Installation

```bash
$ yarn add @shopify/koa-metrics
```

## Usage

```javascript
import Koa from 'koa';
import metrics from '@shopify/koa-metrics';

const app = new Koa();

app.use(metrics(options));
```

### Options

The passed in `options` object adheres to the following API:

```javascript
app.use(
  metrics({
    prefix: 'AppName',
    host: 'some-statsd-host.com:8125',
  }),
);
```

#### `prefix` (required)

The global StatsD metric name prefix; should be provided in `PascalCase`.

#### `host` (required)

The url for the StatsD host; should be provided in the format: `hostname:port`.

## Metrics

We rely on the [hot-shots](https://github.com/brightcove/hot-shots) npm package to send the metrics.

The global StatsD metric name prefix is provided through the [options object](#options).

This package automatically provides performance metrics for HTTP requests:

### Standard tags

* `path`
* `request_method`
* `response_code`
* `response_type`

### Histogram metrics

### `request_time`

Time to complete a request, from the application perspective.

### `request_queuing_time`

Time before a request actually started being processed.

This metric is emitted when the application start processing a request. It relies on the presence of a header `X-Request-Start` set by the first HTTP hop.

### `request_content_length`

This metric is based on the response header `Content-Length`. Some responses don't provide this header (chunked encoding); in those cases, this will be `undefined`.
