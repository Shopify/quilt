# `@shopify/logger`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Flogger.svg)](https://badge.fury.io/js/%40shopify%2Flogger.svg)

Opinionated logger for production-scale applications.

## Installation

```bash
$ yarn add @shopify/logger
```

## Usage

### Instantiation

A basic logger can be created simply by calling the `Logger` constructor:

```typescript
const logger = new Logger();
```

The `Logger` constructor also takes an `options` object. For example:

```typescript
const logger = new Logger({
  name: 'my-logger',
  formatter: new ConsoleFormatter(),
});
```

The `options` object adheres to the following interface:

```typescript
interface LoggerOptions {
  formatter?: Formatter;
  name?: string;
}
```

The `name` of a logger will be used as it's root scope. A formatter may use this to provide context when outputting a log entry. For example, the `ConsoleFormatter` will preface each log with its scope, such as:

```
[my-logger] ℹ info - some log text
```

A `Formatter` is simply an object that implements the `Formatter` interface:

```typescript
export interface Formatter {
  format(entry: FormatEntry): any;
}
```

In addition to writing your own formatter, See [Formatters](#formatters) below for a list of provided formatters.

### Logging

Given the logger above, we can log information to the console using the built-in `info`, `warn`, and `error` functions. For example:

```typescript
logger.info('Hello, world!');
logger.warn('Something bad might happen');
logger.error(new Error('Operation not permitted.'));
```

## Formatters

This package provides the following formatters:

- `ConsoleFormatter`

### `ConsoleFormatter`

Formats and prints logs via `console.log`, `console.warn`, and `console.error`.

#### Screenshots

![`ConsoleFormatter` sample error output](./docs/images/ConsoleFormatter__Error.png)

![`ConsoleFormatter` sample log output on a dark background](./docs/images/ConsoleFormatter__DarkBG.png)

![`ConsoleFormatter` sample log output on a light background](./docs/images/ConsoleFormatter__LightBG.png)
