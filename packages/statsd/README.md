# `@shopify/statsd`

> [!CAUTION]
>
> `@shopify/statsd` is deprecated.
>
> Shopifolk, see
> [Shopify/quilt-internal](https://github.com/shopify/quilt-internal) for
> information on the latest packages available for use internally.

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fstatsd.svg)](https://badge.fury.io/js/%40shopify%2Fstatsd.svg)

An opinionated StatsD client for Shopify Node.js servers and other StatsD utilities.

## Installation

```bash
yarn add @shopify/statsd
```

## Usage

### Client

Create a StatsD client with the following:

```javascript
import {StatsDClient} from '@shopify/statsd';

const statsdClient = new StatsDClient({
  host: 'some-statsd-host.com',
  port: '8125',
  prefix: 'AppName',
  suffix: 'AppSuffix',
  globalTags: {hello: 'world'},
});
```

#### `distribution`

Tracks the statistical distribution of a set of values across your infrastructure.

```javascript
statsdClient.distribution(
  'navigationComplete',
  100, // in milliseconds
  ['navigation', 'complete', 'performance'], // user-defined tags to go with the data
);
```

#### `timing`

Represents the timing stat

```javascript
statsdClient.timing(
  'request_duration',
  100, // in milliseconds
  [], // user-defined tags to go with the data
);
```

#### `gauge`

Represents the gauge stat

```javascript
statsdClient.gauge(
  'my_gauge',
  123.45, // value
  [], // user-defined tags to go with the data
);
```

#### `increment`

Increments a stat by 1.

```javascript
statsdClient.increment(
  'myCounter',
  ['navigation', 'complete', 'performance'], // user-defined tags to go with the data
);
```

Increment can also be supplied a value to increment the metric by.

```javascript
statsdClient.increment(
  'myCounter',
  ['navigation', 'complete', 'performance'], // user-defined tags to go with the data,
  {}, // additional options
  4, // value to increment by
);
```

#### `close`

Close statsd client.
This will ensure all stats are sent and stop statsd from doing anything more.

```javascript
statsdClient.close();
```

#### `childClient`

Create a child client and add more context to the client.
The globalTags will be merged.
The prefix and suffix will be concatenated like in this example.

```javascript
statsdClient.childClient({
  prefix: '.NewPrefix',
  suffix: '.NewSuffix',
  globalTags: {foo: 'bar'},
});
```

In this example the prefix will be `AppName.NewPrefix`, the suffix will be `AppSuffix.NewSuffix` and the globalTags will be `{hello: 'world', foo: 'bar'}`.
