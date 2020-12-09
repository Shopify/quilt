# `@shopify/web-worker`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
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
const worker = createWorker();

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

##### Terminating the worker

When the web worker is no longer required, you can terminate the worker using `terminate()`. This will immediately terminate any ongoing operations. If an attempt is made to make calls to a terminated worker, an error will be thrown.

> Note: A worker can only be terminated from the main thread. A worker can not terminate itself from within the worker module.

```tsx
import {createWorkerFactory, terminate} from '@shopify/web-worker';

const createWorker = createWorkerFactory(() => import('./worker'));
const worker = createWorker();

// ...

terminate(worker);
```

##### Customizing worker creation

By default, this library will create a worker by calling `new Worker` with a blob URL for the worker script. This is generally all you need, but some use cases may want to construct the worker differently. For example, you might want to construct a worker in a sandboxed iframe to ensure the worker is not treated as same-origin, or create a worker farm instead of a worker per script. To do so, you can supply the `createMessenger` option to the function provided by `createWorkerFactory`. This option should be a function that accepts a `URL` object for the location of the worker script, and return a `MessageEndpoint` compatible with being passed to [`@shopify/rpc`’s `createEndpoint`](https://github.com/Shopify/quilt/tree/master/packages/rpc#usage) API.

```ts
import {fromMessagePort} from '@shopify/rpc';
import {createWorkerFactory} from '@shopify/web-worker';

/* imaginary abstraction that vends workers */
const workerFarm = {};

const createWorker = createWorkerFactory(() => import('./worker'));
const worker = createWorker({
  createMessenger(url) {
    return workerFarm.workerWithUrl(url);
  },
});
```

An optimization many uses of `createMessenger` will want to make is to use a [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) to directly connect the worker and the main page, even if the worker itself is constructed unconventionally (e.g., inside an iframe). As a convenience, the worker that is constructed by this library supports `postMessage`ing a special `{__replace: MessagePort}` object. When sent, the `MessagePort` will be used as an argument to the worker’s [`Endpoint#replace` method](../rpc#endpointreplace), making it the communication channel for all messages between the parent page and worker.

```ts
import {fromMessagePort} from '@shopify/rpc';
import {createWorkerFactory} from '@shopify/web-worker';

/* imaginary abstraction that creates workers in an iframe */
const iframe = {};

const createWorker = createWorkerFactory(() => import('./worker'));
const worker = createWorker({
  createMessenger(url) {
    const {port1, port2} = new MessageChannel();
    iframe.createWorker(url).postMessage({__replace: port2}, [port2]);

    // In a real example, you'd want to also clean up the worker
    // you've created in the iframe as part of the `terminate()` method.
    return fromMessagePort(port1);
  },
});
```

###### `createIframeWorkerMessenger()`

The `createIframeWorkerMessenger` is provided to make it easy to create a worker that is not treated as same-origin to the parent page. This function will, for each worker, create an iframe with a restrictive `sandbox` attribute and an anonymous origin, and will force that iframe to create a worker. It then passes a `MessagePort` through to the worker as the `postMessage` interface to use so that messages go directly between the worker and the original page.

```ts
import {
  createWorkerFactory,
  createIframeWorkerMessenger,
} from '@shopify/web-worker';

const createWorker = createWorkerFactory(() => import('./worker'));
const worker = createWorker({
  createMessenger: createIframeWorkerMessenger,
});
```

Note that this mechanism will always fail CORS checks on requests from the worker code unless the requested resource has the `Allow-Access-Control-Origin` header set to `*`.

##### Naming the worker file

By default, worker files created using `createWorkerFactory` are given incrementing IDs as the file name. This strategy is generally less than ideal for long-term caching, as the name of the file depends on the order in which it was encountered during the build. For long-term caching, it is better to provide a static name for the worker file. This can be done by supplying the [`webpackChunkName` comment](https://webpack.js.org/api/module-methods/#magic-comments) before your import:

```ts
import {createWorkerFactory, terminate} from '@shopify/web-worker';

// Note: only webpackChunkName is currently supported. Don’t try to use
// other magic webpack comments.
const createWorker = createWorkerFactory(() =>
  import(/* webpackChunkName: 'myWorker' */ './worker'),
);
```

This name will be used as the prefix for the worker file. The worker will always end in `.worker.js`, and may also include additional hashes or other content (this library re-uses your `output.filename` and `output.chunkFilename` webpack options). You can access the `URL` of a worker file by accessing the `url` property of the function returned by `createWorkerFactory`:

```ts
import {createWorkerFactory, terminate} from '@shopify/web-worker';

const createWorker = createWorkerFactory(() =>
  import(/* webpackChunkName: 'myWorker' */ './worker'),
);

// Something like `new URL(__webpack_public_path__ + 'myWorker.worker.js')`
console.log(createWorker.url);
```

##### "Plain" workers

The power of the `createWorkerFactory` library is that it automatically wraps the `Worker` in an `Endpoint` from `@shopify/rpc`. This allows the seamless calling of module methods from the main thread to the worker, and the ability to pass non-serializable constructs like functions. However, if your use case does not require this RPC layer, you can save on bundle size by creating a "plain" worker factory. The functions created by `createPlainWorkerFactory` can be used to create `Worker` objects directly, with which you can implement whatever message passing system you want.

```ts
import {createPlainWorkerFactory} from '@shopify/web-worker';

const createWorker = createPlainWorkerFactory(() => import('./worker'));
const worker = createWorker();
worker.postMessage('direct postMessage access!');
```

Because you are interacting with the worker directly in this mode, most other features of this library are not relevant (the memory management considerations, the `createMessenger` option, `expose`, `terminate`, etc). However, you can customize the name of the worker file with the [`webpackChunkName` comment](#naming-the-worker-file), just like with workers created via `createWorkerFactory`. The functions returned by `createPlainWorkerFactory` also have a `url` property for the URL of the worker file, like `createWorkerFactory`.

#### Worker

Your worker can be written almost indistinguishably from a "normal" module. It can import other modules (including async `import()` statements), use modern JavaScript features, and more. The exported functions from your module form its public API, which the main thread code will call into as shown above. Note that only functions can be exported; this library is primarily meant to be used to create an imperative API for offloading work to a worker, for which only function exports are needed.

As noted in the browser section, worker code should be mindful of the [limitations](#limitations) of what can be passed into and out of a worker function.

#### Limitations

This library implements the calling of functions on a worker using [`@shopify/rpc`](../rpc). As such, all the limitations and additional considerations in that library must be considered with the functions you expose from the worker. In particular, note the [memory management concerns](../rpc#memory) when passing functions to and from the worker. For convenience, the `release` and `retain` methods from `@shopify/rpc` are re-exported from this library.

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
