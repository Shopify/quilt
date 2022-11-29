# `@shopify/semaphore`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fsemaphore.svg)](https://badge.fury.io/js/%40shopify%2Fsemaphore.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/semaphore.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/semaphore.svg)

The Semaphore class implements a counting [semaphore](<https://en.wikipedia.org/wiki/Semaphore_(programming)>).
It can be useful to control concurrent access to a pool of resources such as:

1. Maintaining a pool of web workers to run background scripts
2. Limiting the number of concurrent requests that can be made to an API endpoint

In more concrete terms, if we take a semaphore with count 3 as an example, the first 3 calls to acquire a permit will resolve immediately and the 4th call will only be resolved when one of the earlier permits is released.

A real-life anology is parking spots at a parking lot. If the parking lot has a capacity for 10 cars, the first 10 cars to arrive will immediately park, but an 11th car will have to wait for one of the cars to leave so that a parking spot is available.

## Installation

```bash
yarn add @shopify/semaphore
```

## Usage

### Instantiation

Create a semaphore instance by calling the `Semaphore` constructor with a count argument:

```typescript
const semaphore = new Semaphore(3);
```

If you need a [lock/mutex](<https://en.wikipedia.org/wiki/Lock_(computer_science)>), a semaphore with a count of 1 will effectively act as one:

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

The `.release)()` method returns a promise that gets resolved when the permit is released and an earlier permit request that had been pending is resolved. Waiting on the resolution of the `.release()` is optional and could be useful in situations where you're having timing issues (e.g. in unit tests that utilize a Semaphore instance):

```typescript
await permit.release();
```

## Example

```typescript
const MAX_SIMULTANEOUS_FETCHES = 2;

const fetchSemaphore = new Semaphore(MAX_SIMULTANEOUS_FETCHES);

async function callApi(path) {
  const permit = await fetchSemaphore.acquire();

  return fetch(path).finally(() => permit.release());
}

callApi(apples).then(renderApples);
callApi(oranges).then(renderOranges);
// The next acquire call won't resolve until one of the earlier permits is released
callApi(bananas).then(renderBananas);
```
