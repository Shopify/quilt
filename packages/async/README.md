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

It also includes a plugin for Babel that allows the module IDs that are asynchronously imported to be exposed to the application.

### Babel

The Babel plugin is exported from the `@shopify/async/babel` entrypoint. This plugin accepts one option: `packages`, which should be an object where the keys are the names of packages, and the values are an array of functions that should be processed. This option defaults to an object containing a few Shopify-specific async packages (`createAsyncComponent` and `createAsyncContext` from `@shopify/react-async`, and `createAsyncQueryComponent` from `@shopify/react-graphql`).

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
  load: () => import('../SomeComponent'),
  id: () => require.resolveWeak('../SomeComponent'),
});
```

### Webpack

In order to make use of the `id` property added by the Babel plugin, you will need to create a manifest of assets keyed by this ID. An example of doing so can be found in [sewing kit’s `webpac-asset-metadata-plugin` package](https://github.com/Shopify/sewing-kit/tree/master/packages/webpack-asset-metadata-plugin).
