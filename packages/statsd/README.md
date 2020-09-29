# `@shopify/statsd`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fstatsd.svg)](https://badge.fury.io/js/%40shopify%2Fstatsd.svg)

An opinionated StatsD client for Shopify Node.js servers and other StatsD utilities.

## Installation

```bash
$ yarn add @shopify/statsd
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

#### `increment`

Increments a stat by 1.

```javascript
statsdClient.increment(
  'myCounter',
  ['navigation', 'complete', 'performance'], // user-defined tags to go with the data
);
```

#### `close`

Close statsd client.
This will ensure all stats are sent and stop statsd from doing anything more.

```javascript
statsdClient.close();
```
