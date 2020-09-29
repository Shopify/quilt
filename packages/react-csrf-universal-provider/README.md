# `@shopify/react-csrf-universal-provider`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-csrf-universal-provider.svg)](https://badge.fury.io/js/%40shopify%2Freact-csrf-universal-provider.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-csrf-universal-provider.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-csrf-universal-provider.svg)

A self-serializing/deserializing CSRF token provider that works for isomorphic applications.

## Installation

```bash
$ yarn add @shopify/react-csrf-universal-provider
```

## Usage

```tsx
// App.tsx

import {CsrfUniversalProvider} from '@shopify/react-csrf-universal-provider';

function App({token}: {token?: string}) {
  return (
    <CsrfUniversalProvider value={token}>
      {/* rest of the app */}
    </CsrfUniversalProvider>
  );
}
```
