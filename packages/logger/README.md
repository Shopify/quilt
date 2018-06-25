# `@shopify/logger`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Flogger.svg)](https://badge.fury.io/js/%40shopify%2Flogger.svg)

Opinionated logger for production-scale applications

## Installation

```bash
$ yarn add @shopify/logger
```

## Usage

### Instantiation

A logger is created by passing in an `options` object to the `Logger` constructor.
For example:

```typescript
const logger = new Logger({
  name: 'my-logger',
  formatter: new ConsoleFormatter(),
});
```

**Notice** the two required arguments: `name` and `formatter`. The `Logger` constructor adheres to the following interface:

```typescript
interface LoggerOptions {
  formatter: Formatter;
  name: string;
}
```

a `Formatter` is simply an object that implements the `Formatter` interface:

```typescript
export interface Formatter {
  next(entry: FormatEntry): any;
}
```

In addition to writing your own formatter, See [Fromatters](#formatters) below for a list of provided formatters.

### Logging

Given the logger above, we can log information to the console using the built-in `info`, `warn`, and `error` functions. For example:

```typescript
logger.info('Hello, world!');
```
