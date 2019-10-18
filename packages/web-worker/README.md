# `@shopify/web-worker`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fweb-worker.svg)](https://badge.fury.io/js/%40shopify%2Fweb-workers.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/web-worker.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/web-worker.svg)

Tools for making [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) fun and type-safe.

## Installation

```bash
$ yarn add @shopify/web-worker
```

## Usage

This library contains three parts that must be used in tandem:

1. The public API of the package provided by `@shopify/web-worker`
1. A webpack plugin provided by `@shopify/web-worker/webpack`
1. A babel plugin provided by `@shopify/web-worker/babel`

### App code

#### Browser

The main thread will use the `createWorkerFactory` function provided by this library to create a function that can build "smart" workers. Developers should pass this function an async `import()` for the module they wish to make into a worker:

```ts
import {createWorkerFactory} from '@shopify/web-worker';

const createWorker = createWorkerFactory(() => import('./worker'));
```

When the resulting function is called, it will return a worker "instance". This instance is directly connected to the worker code, so you are expected to call it as if it were simply that external module. Note that there is one difference: any return values from the worker will be promises, because they are retrieved via message passing (if you use TypeScript, you’ll see the correct return types automatically).

```ts
const worker = createWorker();

// Assuming worker was:
// export function hello(name) {
//   return `Hello, ${name}`;
// }

const result = await worker.hello('world'); // 'Hello, world'
```

Note that more complex workers are allowed; it can export multiple functions, including default exports, and it can accept complex argument types [with some restrictions](#limitations):

```ts
const worker = makeWorker();

// Assuming worker was:
// export default function hello(name) {
//   return `Hello, ${name}`;
// }
//
// export function getName(user) {
//   return user.getDisplayName();
// }

const result = await worker.default(
  await worker.getName({
    getDisplayName: () => 'Tobi',
  }),
); // 'Hello, Tobi'
```

When the web worker is no longer required, you can terminate the worker using `terminate()`. This will immediately terminate any ongoing operations. If an attempt is made to make calls to a terminated worker, an error will be thrown.

> Note: A worker can only be terminated from the main thread. A worker can not terminate itself from within the worker module.

```tsx
import {createWorkerFactory, terminate} from '@shopify/web-worker';

const createWorker = createWorkerFactory(() => import('./worker'));
const worker = createWorker();

// ...

terminate(worker);
```

#### Worker

Your worker can be written almost indistinguishably from a "normal" module. It can import other modules (including async `import()` statements), use modern JavaScript features, and more. The exported functions from your module form its public API, which the main thread code will call into as shown above. Note that only functions can be exported; this library is primarily meant to be used to create an imperative API for offloading work to a worker, for which only function exports are needed.

As noted in the browser section, worker code should be mindful of the [limitations](#limitations) of what can be passed into and out of a worker function.

Your worker functions should be careful to note that, if they accept any arguments that include functions, those functions should at least optionally return a promise. This is because, when this argument is passed from the main thread to the worker, it can only pass a function that returns a promise. To help you make sure you are respecting this condition, we provide a `SafeWorkerArgument` helper type you can use for all arguments that your worker accepts.

```ts
import {SafeWorkerArgument} from '@shopify/web-worker';

export function greet(name: SafeWorkerArgument<string | () => string>) {
  // name is `string | (() => string | Promise<string>)` because a worker
  // can synchronously pass a `string` argument, but can only provide a
  // `() => Promise<string>` function, since it will have to proxy over
  // message passing. Note that `() => string` is still allowed because
  // it could still be valid for another function in the worker to call
  // with a function of that type.
  return (
    typeof name === 'string'
      ? `Hello, ${name}`
      : Promise.resolve(name()).then((name) => `Hello, ${name}`)
  );
}
```

The same [memory management concerns](#memory) apply to the worker as they do on the main thread.

#### Limitations

There are two key limitations to be aware of when calling functions in a worker with the help of this library:

1. Only basic data structures are supported. Any function involved in a call across the main thread/ worker boundary can accept and return primitive types, objects, arrays, and functions. You can’t pass other data structures (like `Map`s or `Set`s), and if you pass class instances back and forth, only their own properties will be available on the other side.
2. The worker can only export functions. Because the main thread can’t access the worker thread values synchronously, there is no way to implement arbitrary access to non-function exports without awkward use of promises.

Additionally, when passing functions to and from the worker, developers may occasionally need to manually manage memory. This is detailed in the next section.

#### Memory

Web worker’s can’t share memory with their parent, and functions can’t be serialized for `postMessage`. The implementation of passing functions between worker and parent is therefore implemented very differently from other data types: the worker and parent side keep references to functions that have been passed between the two, and they have a shared strategy for proxying calls from the "target" side back to the original source function.

This strategy is effective, but without extra intervention it will leak memory. Even if the parent and worker no longer have references to that function, it must still be retained because the parent can’t know that the worker no longer needs to call that function.

This library automatically implements some memory management for you. A function passed between the worker and parent is automatically retained for the lifetime of the original function call, and is subsequently released.

```ts
// PARENT

const worker = createWorker(/* ... */)();
const funcForWorker = () => 'Tobi';

worker
  // funcForWorker is retained on the main thread here...
  .greet(funcForWorker)
  // And is automatically released here because the worker
  // signals it no longer needs the function
  .then(result => console.log(result));

// WORKER

export async function greet(getName: () => Promise<string>) {
  // Worker signals that it needs to retain `getName`, which
  // was passed from the parent.

  try {
    return `Hello, ${await getName()}`;
  } finally {
    // Once this function exits, the library defaults to releasing
    // `getName`, which signals to the main thread it can release
    // the original function.
  }
}
```

This covers most common memory management cases, but one important exception remains: if you save the function on to an object in context, it will be still be accessible to your program, but the source of the function will be told to release the reference to that function. In this case, if you try to call the function from the worker at a later time, you will receive an error indicating that the value has been released.

To resolve this problem, this library provides `retain` and `release` functions. Calling these on an object will increment the number of "retainers", allowing the source function to be retained. Any time you call `retain`, you must eventually call `release`, when you know you will no longer call that function.

```ts
// WORKER

import {retain, release} from '@shopify/web-worker';

export function setNameGetter(getName: () => Promise<string>) {
  retain(getName);

  if (self.getName) {
    release(self.getName);
  }

  self.getName = getName;
}

export async function greet() {
  return `Hello, ${self.getName ? await self.getName() : 'friend'}!`;
}
```

Remember that any function passed between the worker and its parent, including functions attached as properties of objects, must be retained manually if you intend to call them outside the scope of the first function where they were passed over the bridge. To help make this easier, `release` and `retain` will automatically deeply release/ retain all functions when they are called with objects or arrays.

### Tooling

> Note: if you use sewing-kit, all of the configuration below is automatically performed if you have at least @shopify/sewing-kit@0.110.0, and you have installed either @shopify/web-worker or @shopify/react-web-worker.

To use this library, you must use webpack. When configuring webpack, include the Babel plugin this library provides for any modules that might contain a call to `createWorkerFactory()`, and include the `WebWorkerPlugin` exported by `@shopify/web-worker/webpack`:

```js
import {WebWorkerPlugin} from '@shopify/web-worker/webpack';

const webpackConfig = {
  // rest of webpack config...
  plugins: [new WebWorkerPlugin()],
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: [require.resolve('@shopify/web-worker/babel')],
            },
          },
        ],
      },
    ],
  },
};
```

The `WebWorkerPlugin` helps coordinate a few things during webpack compilation and allows you to pass options to the loader, which is otherwise completely hidden. The following options are accepted by the `WebWorkerPlugin` constructor:

- `globalObject`: allows you to customize the [`options.output.globalObject`](https://webpack.js.org/configuration/output/#outputglobalobject) option passed to the child Webpack compiler. By default, this is set to `self`, which works well in workers, but if you have a different global object that must be used, you can pass it here.
- `plugins`: an array of [webpack plugins](https://webpack.js.org/plugins/) to include in the child compilation of the worker. This library automatically includes a few plugins that will generate output code appropriate for workers.

#### Tests

We do **not** recommend including the Babel plugin for the test environment. When the Babel plugin is omitted, `Factory` will know to access your module asynchronously, and will proxy all method calls to it. To be clear, when in this mode, the function returned from `createWorkerFactory` **will not** actually construct a `Worker` for your code. As a result, this feature will only work if your worker code is written such that it will also execute successfully on the "main" thread. If you do use features in the worker that make it incompatible to run alongside the browser code, we recommend mocking the "worker" module (using `jest.mock()`, for example).

## How does it work?

The `@shopify/web-worker/babel` Babel plugin looks for any instances of calling `createWorkerFactory`. For each one, it looks for the nested `import()` call, and then for the imported path (e.g., `./worker`). It then replaces the first argument to `createWorkerFactory` with an import for the worker module that references a custom Webpack loader:

```ts
import {createWorkerFactory} from '@shopify/web-worker';
createWorkerFactory(() => import('./worker'));

// becomes something like:
import {createWorkerFactory} from '@shopify/web-worker';
import workerStuff from '@shopify/web-worker/webpack-loader!./worker';
createWorkerFactory(workerStuff);
```

When webpack attempts to process this import, it sees the loader syntax, and passes the worker script to this package’s custom webpack loader. This loader does most of the heavy lifting. It creates an in-memory module (using information it pulls off the `WebWorkerPlugin` instance it finds in the Webpack compiler) that exposes the worker API using the `expose()` function from this library:

```ts
// This is the imaginary module the loader creates and compiles
import {expose} from '@shopify/web-worker';
import * as api from './worker';
expose(api);
```

This imaginary module is then compiled using a child compiler in Webpack. The loader then takes the resulting asset metadata from compiling the worker, and makes that information the exported data from the original `./worker` module. Finally, `createWorkerFactory()` takes this metadata (which includes the main script tag that should be loaded in the worker) and, when called, creates a new `Worker` instance using a `Blob` that simply `importScripts` the main script for the worker.

The actual communication between the parent and worker is the most complex part of this library. The basic idea is that, when a method of the worker is called from the main thread, it is turned in to a message that deeply serializes all of the arguments. The worker receives that message (via `postMessage`) and calls the relevant export from the worker module. The return result is then serialized and sent back to the parent (again, via `postMessage`).

Most serialization relies on the basic structured cloning done automatically for `Worker#postMessage`, but functions are pre-processed. Because these values can’t be serialized, there is no way of passing them directly between the parent and worker. Instead, the parent or worker (whichever is passing a function) stores the value of the original function, assigns it an ID, creates a `MessageChannel`, and sends that information in place of the function itself. The other side receives that object, and turns it into a `Proxy`; this `Proxy` listens for calls, and forwards them to the original owner of the function using the `MessageChannel` (again, serializing using `postMessage`). As discussed in the [memory](#memory) section, the library also performs some basic memory management automatically. Once `WeakRef`s are available in JavaScript, they will be adopted to automatically release references to proxied functions.
