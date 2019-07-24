# `@shopify/resource-pool`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fresource-pool.svg)](https://badge.fury.io/js/%40shopify%2Fresource-pool.svg)  [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/resource-pool.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/resource-pool.svg)

Maintains controlled concurrent access to a pool of resources. This can be useful for performing asynchronous operations over a limited number of resource instances such as running background scripts on a set of web workers.

## Installation

```bash
$ yarn add @shopify/resource-pool
```

## Usage

Create a ResourcePool instance by passing in an object with the properties:
* `count` - The number of resources to have in the pool
* `createResource` - A callback to create a new resource
* `destroyResource` - A callback to destroy a resource

```typescript
const resourcePool = new ResourcePool<MyResource>({
  count: 3,
  createResource() {
    new MyResource();
  },
  destroyResource(resource: MyResource) {
    resource.destroy();
  }
});
```

Then use the `.acquire()` method to request access to a resource:

```typescript
const {resource, release} = await resourcePool.acquire();
```

The `.acquire()` call returns a promise that is resolved when a free resource is available. The promise is resolved with an object with the properties:
* `resource` - A resource instance that was created by the `createResource` callback
* `release` - A method to release the resource instance when you're done with it. Note that this method *does not destroy* the resource. It just makes it free for other `acquire()` calls.

Call `release()` to free up the resource:

```typescript
release();
```

The `release()` method returns a promise that can be waited on, in situations where synchronization of events is important (e.g. in unit tests where you're checking the outcome of asynchronous calls.)

```typescript
await release();
```

If there are no free resources left in the pool, the next `.acquire()` call will only get resolved when one of the resources is released:

```typescript
const {resource: resource1, release: release1} = await resourcePool.acquire();
const {resource: resource2, release: release2} = await resourcePool.acquire();
const {resource: resource3, release: release3} = await resourcePool.acquire();

resourcePool.acquire().then({resource} => {
  // Will only get here when one of release1, release2 or release3 is called
});
```

Calling the `.destroy()` method of the ResourcePool instance will destroy the resource instances in the pool by passing them to the `destroyResource` callback:

```typescript
resourcePool.destroy();
```
