# `@shopify/web-worker`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fweb-workers.svg)](https://badge.fury.io/js/%40shopify%2Fweb-workers.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/web-workers.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/web-workers.svg)

Tools for making [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) fun and type-safe.

## Installation

```bash
$ yarn add @shopify/web-worker
```

## Usage

This library contains three parts that must be used in tandem:

1. A babel plugin provided by `@shopify/web-worker/babel`
2. A webpack plugin provided by `@shopify/web-worker/webpack`
3. The public API of the package provided by `@shopify/web-worker`

### App code

#### Browser

The main thread will use the `createWorker` function provided by this library to create a function that can build "smart" workers. Developers should pass this function an async `import()` for the module they wish to make into a worker:

```ts
import {createWorker} from '@shopify/web-worker';

const makeWorker = createWorker(() => import('./worker'));
```

When the resulting function is called, it will return a worker "instance". This instance is directly connected to the worker code, so you are expected to call it as if it were simply that external module. Note that there is one difference: any return values from the worker will be promises, because they are retrieved via message passing (if you use TypeScript, you’ll see the correct return types automatically).

```ts
const worker = makeWorker();

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

TODO

#### Memory

TODO

### Tooling

To use this library, you must use webpack. When configuring webpack, include the Babel plugin this library provides for any modules that might contain a call to `createWorker()`, and include the `WebWorkerPlugin` exported by `@shopify/web-worker/webpack`:

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

We do **not** recommend including the Babel plugin for the test environment. When the Babel plugin is omitted, `createWorker` will know to access your module asynchronously, and will proxy all method calls to it. To be clear, when in this mode, `createWorker` **will not** actually construct a `Worker` for your code. As a result, this feature will only work if your worker code is written such that it will also execute successfully on the "main" thread. If you do use features in the worker that make it incompatible to run alongside the browser code, we recommend mocking the "worker" module (using `jest.mock()`, for example).

## How does it work?

The `@shopify/web-worker/babel` Babel plugin looks for any instances of calling `createWorker`. For each one, it looks for the nested `import()` call, and then for the imported path (e.g., `./worker`). It then replaces the first argument to `createWorker` with an import for the worker module that references a custom Webpack loader:

```ts
import {createWorker} from '@shopify/web-worker';
createWorker(() => import('./worker'));

// becomes something like:
import * as workerStuff from '@shopify/web-worker/webpack-loader!./worker';
createWorker(workerStuff);
```

When webpack attempts to process this import, it sees the loader syntax, and passes the worker script to this package’s custom webpack loader. This loader does most of the heavy lifting. It creates an in-memory module (using information it pulls off the `WebWorkerPlugin` instance it finds in the Webpack compiler) that exposes the worker API using the `expose()` function from this library:

```ts
// This is the imaginary module the loader creates and compiles
import {expose} from '@shopify/web-worker';
import * as api from './worker';
expose(api);
```

This imaginary module is then compiled using a child compiler in Webpack. The loader then takes the resulting asset metadata from compiling the worker, and makes that information the exported data from the original `./worker` module. Finally, `createWorker()` takes this metadata (which includes the main script tag that should be loaded in the worker) and, when called, creates a new `Worker` instance using a `Blob` that simply `importScripts` the main script for the worker.

TODO: how the proxying works
