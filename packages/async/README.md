# `@shopify/async`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fasync.svg)](https://badge.fury.io/js/%40shopify%2Fasync.svg)

Primitives for loading parts of an application asynchronously.

## Installation

```bash
$ yarn add @shopify/async
```

## Usage

This package contains a few types that are useful for creating async components:

- `Import` represents a value that could be default or non-default export
- `LoadProps` are an interface that describe the shape of props that must be used for a function to be processed by the Babel plugin provided by this

It also has two plugins that allow the module IDs that are asynchronously imported to be exposed to the application: one for Webpack, and one for Babel.

### Babel

The Babel plugin is exported from the `@shopify/async/babel` entrypoint. This plugin accepts one option: `packages`, which should be an object where the keys are the names of packages, and the values are an array of functions that should be processed. This option defaults to an object containing a few Shopify-specific async packages.

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

This plugin will look for any functions imported from the specified packages. It will then iterate over each reference to that function and, if the reference is a call expression where the first argument is an object, and that object has a `load` function, will mark it for processing. The adjustment is simple: it simply adds an `id` method that returns a Webpack-specific identifier based on the first dynamic import in the `load` method, allowing the function to use this identifier to mark the module as used.

```js
import {createAsyncComponent} from 'my-package';

createAsyncComponent({
  load: () => import('../SomeComponent'),
});

// Becomes:

createAsyncComponent({
  id: () => require.resolveWeak('../SomeComponent'),
  load: () => import('../SomeComponent'),
});
```

### Webpack

The Webpack plugin is exported from the `@shopify/async/webpack` entrypoint. This plugin creates a manifest of async bundles produced by Webpack that can be easily cross-referenced with the module identifiers added by the Babel plugin. It accepts a single option, which is the filename to use for the manifest (defaults to `async-manifest.json`). This manifest will be output alongside your other files based on Webpack’s `output` options.

```ts
// webpack.config.ts
import {AsyncPlugin} from '@shopify/async/webpack';

export default {
  // ... rest of config
  plugins: [new AsyncPlugin({filename: 'manifest.json'})],
};
```
