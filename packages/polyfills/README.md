# `@shopify/polyfills`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fpolyfills.svg)](https://badge.fury.io/js/%40shopify%2Fpolyfills.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/polyfills.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/polyfills.svg)

Blessed polyfills for web platform features. Exports browser, Node, and Jest/jsdom polyfills where appropriate.

The following polyfills are currently provided:

- `base`: ensures that all necessary JavaScript language features are polyfilled, including `Map`, `Set`, async functions, `Symbol`, and more.
- `fetch`: Ensures a global WHATWG `fetch` function is available.
- `formdata`: Ensures `FormData` is available globally (browser/ JSDom only).
- `idle-callback`: Ensures `requestIdleCallback` and `cancelIdleCallback` are available globally (browser/ JSDom only).
- `intersection-observer`: Ensures [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is available globally (browser/ JSDom only).
- `intl`: Ensures `Intl.PluralRules` is defined.
- `mutation-observer`: Ensures `MutationObserver` is available globally (browser/ JSDom only).

## Installation

```bash
$ yarn add @shopify/polyfills
```

## Usage

All you need to do is import the polyfills you use in your application:

```typescript
import '@shopify/polyfills/base';
import '@shopify/polyfills/fetch';
```

In apps rendered on the client and server, we recommend importing these polyfills only once, in your top-level app component. Because this component is likely to be imported first by both the server and client bundles, the polyfills will be available throughout the application code. However, you may also need to import these files earlier in the execution of a Node server (if your server code uses features like `fetch` outside of the application). You will also likely need to import these in your test setup files, as most tests will not import the root app component.

## Build configuration

This package also provides a way to configure your bundler to remap polyfill imports based on the environment being built. This allows you to import polyfills you need without worrying about whether they should be omitted in some cases, or omitted entirely. `sewing-kit` uses this feature automatically to ensure correct polyfills for tests, server builds, and client builds.

To make use of this feature, call `mappedPolyfillsForEnv`, exported from the root of this project, and pass in the environment being targeted. The environment must be one of `node`, `jest`, or a list of supported browsers (supplied as a browserslist-compatible query).

The following example shows how to use this feature to define Webpack aliases:

```typescript
import {mappedPolyfillsForEnv} from '@shopify/polyfills';

// Server
module.exports = {
  resolve: {
    alias: mappedPolyfillsForEnv('node'),
  },
};

// Client
module.exports = {
  resolve: {
    alias: mappedPolyfillsForEnv(['last 2 versions']),
  },
};
```
