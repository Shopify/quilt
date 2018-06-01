# `@shopify/react-performance`

[![CircleCI](https://circleci.com/gh/Shopify/quilt.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-performance.svg)](https://badge.fury.io/js/%40shopify%2Freact-performance.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-performance.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-performance.svg)

Reduces request latency by preconnecting hosts.

## Installation

```bash
$ yarn add @shopify/react-performance
```

## Usage

This library exposes a `<Preconnect />` component, which adds `<link />`s to `<head></head>` for the given `host`s with `dns-prefetch` and `preconnect` [relations](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).

```javascript
import {Preconnect} from 'react-performance';

...

function App(props) {
  const preconnectHost = 'api.example.com'
  <Preconnect host={preconnectHost} />
}

// or multiple hosts

function App(props) {
  const preconnectHosts = [
    'api.example.com',
    'example.com',
    'example2.com',
  ]

  <Preconnect host={preconnectHosts} />
}
```

## Interface

```typescript
export interface Props {
  host: string | string[];
}
```
