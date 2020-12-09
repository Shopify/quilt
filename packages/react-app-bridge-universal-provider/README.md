# `@shopify/react-app-bridge-universal-provider`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-app-bridge-universal-provider.svg)](https://badge.fury.io/js/%40shopify%2Freact-app-bridge-universal-provider.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-app-bridge-universal-provider.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-app-bridge-universal-provider.svg)

A self-serializing/deserializing [`app-bridge-react`](https://github.com/Shopify/app-bridge/tree/master/packages/app-bridge-react) provider that works for isomorphic applications.

## Installation

```bash
$ yarn add @shopify/react-app-bridge-universal-provider
```

## Usage

### Props

The component takes children, `apiKey`, `shopOrigin`, and `forceRedirect`. Similar to `@shopify/app-bridge-react`'s Provider.

### Example

```tsx
// App.tsx

import {AppBridgeUniversalProvider} from '@shopify/react-app-bridge-universal-provider';

function App({apiKey, shopOrigin}: {apiKey?: string; shopOrigin?: string}) {
  return (
    <AppBridgeUniversalProvider apiKey={apiKey} shopOrigin={shopOrigin}>
      {/* rest of the app */}
    </AppBridgeUniversalProvider>
  );
}
```
