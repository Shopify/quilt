# `@shopify/semaphore`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fsemaphore.svg)](https://badge.fury.io/js/%40shopify%2Fsemaphore.svg)  [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/semaphore.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/semaphore.svg)

Counting [semaphore](https://en.wikipedia.org/wiki/Semaphore_(programming))

## Installation

```bash
$ yarn add @shopify/semaphore
```

## Usage

### Instantiation

Create a semaphore instance by calling the `Semaphore` constructor with a count argument:

```typescript
const semaphore = new Semaphore(3);
```

If you need a mutex, a semaphore with a count of 1 will effectively act as one:

```typescript
const mutex = new Semaphore(1);
```

### Acquiring permits

Call `.acquire()` on a Semaphore instance to acquire a permit. The result is a promise that gets resolved with a Permit instance when a permit is available:

```typescript
const permit = semaphore.acquire();
```

### Releasing permits

Call the `.release()` method on a Permit instance to release it:

```typescript
permit.release();
```

## Example

```typescript
const MAX_SIMULTANEOUS_FETCHES = 2;

const fetchSemaphore = new Semaphore(MAX_SIMULTANEOUS_FETCHES);

async function throttledFetch(path) {
  const permit = await fetchSemaphore.acquire();

  return fetch(path)
    .finally(() => permit.release());
}

throttledFetch(apples).then(renderApples);
throttledFetch(oranges).then(renderOranges);
// The next acquire call won't resolve until one of the earlier permits is released
throttledFetch(bananas).then(renderBananas);
```
