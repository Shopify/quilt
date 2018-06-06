# `@shopify/react-preconnect`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-preconnect.svg)](https://badge.fury.io/js/%40shopify%2Freact-preconnect.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-preconnect.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-preconnect.svg)

Reduces request latency by preconnecting hosts

## Installation

```bash
$ yarn add @shopify/react-preconnect
```

## Usage

This library default exports a `<Preconnect />` component, which adds `<link />`s to `<head></head>` for the given `hosts` with `dns-prefetch` and `preconnect` [relations](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).

```javascript
import Preconnect from 'react-preconnect';

...

function App(props) {
  const preconnectHosts = [
    'api.example.com',
    'example.com',
    'example2.com',
  ]

  <Preconnect hosts={preconnectHosts} />
}
```

## Interface

```typescript
export interface Props {
  hosts: string[];
}
```
