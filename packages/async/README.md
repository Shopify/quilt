# `@shopify/async`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fasync.svg)](https://badge.fury.io/js/%40shopify%2Fasync.svg)

Primitives for loading parts of an application asynchronously.

## Installation

```bash
$ yarn add @shopify/async
```

## Usage

This package provides a wrapper for asynchronous import statements that allows for synchronous resolution and cacheing. This wrapper can be created using the `createResolver` function. The resulting `Resolver` object exposes a number of methods for interacting with the loaded module.

```ts
const resolver = createResolver({
  load: () => import('./expensive'),
});

// Access the resolved module, if available. If an `id` option is provided
// to `createResolver`, the resolver will attempt to synchronously
// resolve the module based on the environment and the passed identifier.
resolver.resolved;

// If you provide an `id` option to `createResolver`, it will be
// reflected here
resolver.id;

// Force the module to resolve. Returns a promise for the resolved value.
resolver.resolve();
```

This package also contains a few types that are useful for creating async components:

- `Import` represents a value that could be default or non-default export
- `DeferTiming` is an enum of defer timing values; has values for component `Mount`, browser `Idle`, or element `InViewport`

As well as the following types related to `window.requestIdleCallback`:

- `RequestIdleCallbackHandle`
- `RequestIdleCallbackOptions`
- `RequestIdleCallbackDeadline`
- `RequestIdleCallback`
- `WindowWithRequestIdleCallback`

Finally, this package includes a plugin for Babel that allows the module IDs that are asynchronously imported to be exposed to the application.

### Babel

The Babel plugin is exported from the `@shopify/async/babel` entrypoint. This plugin will look for any functions imported from the specified packages. It will then iterate over each reference to that function and, if the reference is a call expression where the first argument is an object, and that object has a `load` function, will mark it for processing. The adjustment is simple: it simply adds an `id` method that returns a Webpack-specific identifier based on the first dynamic import in the `load` method, allowing the function to use this identifier to mark the module as used.

```js
import {createAsyncComponent} from 'my-package';

createAsyncComponent({
  load: () => import('../SomeComponent'),
});

// Becomes:

createAsyncComponent({
  load: () => import('../SomeComponent'),
  id: () => require.resolveWeak('../SomeComponent'),
});
```

#### Options

##### `packages`

`packages` should be an object where the keys are the names of packages, and the values are an array of functions that should be processed. This option defaults to an object containing a few Shopify-specific async packages (`createAsyncComponent` and `createAsyncContext` from `@shopify/react-async`, and `createAsyncQueryComponent` from `@shopify/react-graphql`).

```js
// babel.config.js
{
  plugins: [
    ['@shopify/async/babel', {
      packages: {
        'my-package': ['createAsyncComponent'],
      },
    }],
  ],
}
```

##### `webpack`

If you are using your components in a non-Webpack environment (for example, in Jest), you can pass the `webpack: false` option to this plugin. This disables the Webpack-specific `require.resolveWeak` addition, and instead uses `require.resolve`. The resulting `id` can then be used to synchronously require the module in Node.js.

### Webpack

In order to make use of the `id` property added by the Babel plugin, you will need to create a manifest of assets keyed by this ID. An example of doing so can be found in [sewing kit’s `webpack-asset-metadata-plugin` package](https://github.com/Shopify/sewing-kit/tree/master/packages/webpack-asset-metadata-plugin).
