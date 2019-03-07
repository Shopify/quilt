# `@shopify/polyfills`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fpolyfills.svg)](https://badge.fury.io/js/%40shopify%2Fpolyfills.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/polyfills.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/polyfills.svg)

Blessed polyfills for web platform features. Exports browser and node polyfills where appropriate.

The following polyfills are currently exported:

- `baseline` - The minimum required polyfills for a Shopify app to work in a legacy browser. This includes:
  - `@babel/polyfill`
  - `unhandled-rejection`
  - `fetch`
- `baseline.node` - The minimum required polyfills for a Shopify app to work in node. This includes:
  - `@babel/polyfill`
  - `fetch`
- `fetch` (`fetch.node`): Polyfills whatwg-fetch in the browser and node-fetch in node
- `url` (`url.node`): Polyfills URLSearchParams
- `intl`: Browser only, polyfills Intl.PluralRules

## Installation

```bash
$ yarn add @shopify/polyfills
```

## Usage

**No index file is exported.** You must specify the polyfills that you actually need in your project.

In a project:

```typescript
import '@shopify/polyfills/baseline';
import '@shopify/polyfills/url';
```

## Module Bundler Configuration

This module also provides a way to configure your bundler to remap polyfill imports based on the environment being built for. For example, if you are building for node, you can have your bundler remap `@shopify/polyfills/fetch` to `@shopify/polyfills/fetch.node`. This allows you to maintain only one list of polyfills in your app codebase. **Sewing-kit** will perform this translation for you automatically.

For this example usage, we will use webpack.

```typescript
import {mappedPolyfillsForEnv} from '@shopify/polyfills/config';

module.exports = {
  resolve: {
    alias: {
      ...mappedPolyfillsForEnv(env.isServer ? 'node' : env.supportedBrowsers),
    },
  },
};
```

The argument for `mappedPolyfillsForEnv` can be either `'node'` or a string (or array of strings) provided by the `browserslist` module. These will then be run through `caniuse` to determine if each polyfill is required for that particular browser or combination of browsers. If it is not, imports for that polyfill will be no-op.

You can use this to build two (or more) browser bundles that contain different amounts of polyfills to serve to different browsers. Note, however, that this would also required server support to serve a different built bundle based on a request's user agent.
