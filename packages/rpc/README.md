# `@shopify/rpc`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Frpc.svg)](https://badge.fury.io/js/%40shopify%2Frpc.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/rpc.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/rpc.svg)

Utilities for `postMessage`-based remote procedure calls.

## Installation

```bash
$ yarn add @shopify/rpc
```

## Usage

This library provides a way of constructing a messaging "endpoint" from a `postMessage`-supporting object. The resulting endpoint is connected to the other side of the `postMessage` object; it can expose functions for that environment to call, and it can call exposed functions from that environment. These function calls support passing arbitrary arguments, so long as they are primitive data structures, and functions passed across this "bridge" are serialized using a configurable strategy system.

To start, you’ll need an object that has `postMessage`, `addEventListener('message')`, `removeEventListener('message')`, and (optional) `terminate` methods. Many JavaScript classes have this interface already, including `iframe`s, web workers, and `MessageChannel`s, and many others can be seamlessly bridged (node `worker_threads`, web sockets, etc). There are additional "adaptor" functions to create a compatible object exported from this library; search for the exported functions beginning with `from`.

This `postMessage`ing object is then passed to the `createEndpoint` function of this library:

```ts
import {createEndpoint, fromWebWorker} from '@shopify/rpc';

const worker = new Worker('worker.js');
const endpoint = createEndpoint(fromWebWorker(worker));
```

The `createEndpoint` function accepts an optional second argument that allows you to configure some behaviors of the resulting `Endpoint`:

- `uuid`: a function that returns strings usable as globally unique identifiers.
- `createFunctionStrategy`: a function that returns a [`FunctionStrategy` to use](#function-strategies).

### `Endpoint`

The resulting `Endpoint` object has a number of useful methods and properties.

#### `Endpoint#expose()`

If you want an endpoint created on the "other side" of the `postMessage` interface to be able to call methods, you will need to expose them first. You do so by calling `expose` with a mapping of function name to implementation. These methods are then "callable" from the [`endpoint.call` object of the sibling endpoint](#endpointcall).

```ts
const endpoint = createEndpoint(messenger);

endpoint.expose({
  greet(name: string) {
    return `Hello, ${name}!`;
  },
});
```

If any of the exposed methods accept functions (including nested as methods or as elements in an array), you will have to consider what will be possible for those functions to return in the case where the function is called with this library. Because functions can’t be serialized, they are transferred between endpoints using a strategy that relies on message passing, and is therefore always asynchronous. So, any functions your exposed function accepts should be able to return promises. To help you ensure this, you can use the `SafeRpcArgument` helper type.

```ts
import {createEndpoint, SafeRpcArgument} from '@shopify/rpc';

const endpoint = createEndpoint(messenger);

endpoint.expose({
  // getName becomes () => string | Promise<string>
  async greet(getName: SaveRpcArgument<() => string>) {
    return `Hello, ${await getName()}!`;
  },
});
```

Also note that you will need to consider [memory management](#memory) when your exposed functions accept functions as arguments.

#### `Endpoint#call`

The `endpoint.call` object allows you to call methods that were exposed on the sibling endpoint. If we were continuing from the example above, the other endpoint would be able the `greet` method as follows:

```ts
const endpoint = createEndpoint(messenger);

// Logs "Hello, Michelle!"
endpoint.call.greet('Michelle').then(result => console.log(result));
```

This example also demonstrates that, because this function call is implemented using messages, it will always return a promise for the result, even if the source function returned synchronously.

#### `Endpoint#terminate()`

Closes the underlying `postMessage` channel (by calling its `terminate` method, if present), and clears out all stored functions.

#### `Endpoint#replace()`

Replaces the underling `postMessage` channel. This feature is rarely necessary, so make sure you know what you are doing if you use it.

#### `Endpoint#functions`

The `FunctionStrategy` for this endpoint. This feature is rarely needed, so make sure you know what you are doing if you use it. You can find more details about the function strategy in the [function strategies section](#function-strategies).

### Memory

Functions can’t be serialized for `postMessage`. The implementation of passing functions between endpoints is therefore implemented very differently from other data types: the worker and parent side keep references to functions that have been passed between the two, and they have a shared strategy for proxying calls from the "target" side back to the original source function.

This strategy is effective, but without extra intervention it will leak memory. Even if the parent and worker no longer have references to that function, it must still be retained because the parent can’t know that the worker no longer needs to call that function.

This library automatically implements some memory management for you. A function passed between the worker and parent is automatically retained for the lifetime of the original function call, and is subsequently released.

```ts
import {createEndpoint, fromMessagePort} from '@shopify/rpc';

const {port1, port2} = new MessageChannel();

const endpoint1 = createEndpoint(fromMessagePort(port1));
const endpoint2 = createEndpoint(fromMessagePort(port2));

endpoint2.expose({
  greet(getName: () => Promise<string>) {
    // Function signals that it needs to retain `getName`, which
    // was passed from endpoint1.

    try {
      return `Hello, ${await getName()}`;
    } finally {
      // Once this function exits, the library defaults to releasing
      // `getName`, which signals to endpoint1 that it can release
      // the original function.
    }
  },
});

const funcForEndpoint2 = () => 'Tobi';

endpoint1.call.greet(funcForEndpoint2);
```

This covers most common memory management cases, but one important exception remains: if you save the function on to an object in context, it will be still be accessible to your program, but the source of the function will be told to release the reference to that function. In this case, if you try to call the function from the destination endpoint at a later time, you will receive an error indicating that the value has been released.

To resolve this problem, this library provides `retain` and `release` functions. Calling these on an object will increment the number of "retainers", allowing the source function to be retained. Any time you call `retain`, you must eventually call `release`, when you know you will no longer call that function.

```ts
import {retain, release} from '@shopify/rpc';

const self = {};

endpoint.expose({
  setNameGetter(getName: () => Promise<string>) {
    retain(getName);

    if (self.getName) {
      release(self.getName);
    }

    self.getName = getName;
  },
  greet() {
    return `Hello, ${self.getName ? await self.getName() : 'friend'}!`;
  },
});
```

Remember that any function passed the endpoints, including functions attached as properties of objects, must be retained manually if you intend to call them outside the scope of the first function where they were passed over the bridge. To help make this easier, `release` and `retain` will automatically deeply release/ retain all functions when they are called with objects or arrays.

### Adaptors

Many different JavaScript objects support the necessary `postMessage` interface for using this library. However, some have slightly different APIs that need to be adapted for use with this library. To help, this library provides a number of easy-to-use adaptors, which all return a value that you can pass directly to `createEndpoint`:

- `fromWebWorker(worker: Worker)`: creates a message endpoint from a web worker.
- `fromMessagePort(messagePort: MessagePort)`: creates a message endpoint from a `MessagePort` object.

### Function strategies

In order to pass functions as arguments across the "bridge" between endpoints, the two sides need to agree on a serializing and deserializing technique. The strategy chosen will also likely have memory management considerations. How these functions are serialized is decided by the `createFunctionStrategy` option in `createEndpoint`. These functions accept `FunctionStrategyOptions`, and return a `FunctionStrategy` that manages functions being passed over the endpoint. Both endpoints for a given message channel should use the same type of function strategy, so if you customize one, you must customize them both.

Two function strategies are provided by this library:

- Messenger-based, using `createMessengerFunctionStrategy()`: this strategy will send messages over the "main" message channel. It can work for any type of `postMessage` channel.
- Channel-based, using `createChannelFunctionStrategy()`: this strategy will create `MessageChannel`s for each serialized function, and will use the resulting `MessagePort`s for communicating. This strategy works well for endpoints wrapping web workers, iframes, and node worker threads.
