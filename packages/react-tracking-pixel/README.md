# `@shopify/react-tracking-pixel`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel.svg)](https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-tracking-pixel.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-tracking-pixel.svg)

Allows React apps to easily embed tracking pixel iframes.

## Installation

```bash
$ yarn add @shopify/react-tracking-pixel
```

## Usage

This library exports a `<TrackingPixel />` component, which allows React apps to easily embed tracking pixel iframes.

### Basic Example

```jsx
import TrackingPixel from 'react-tracking-pixel';

// ...

const myurl = 'myurl';

<TrackingPixel url={myurl} />;
```

### With Proconnected Hosts

```jsx
import TrackingPixel from 'react-tracking-pixel';

// ...

const myurl = 'myurl';
const myhosts = ['example.com', 'moreexamples.com'];

<TrackingPixel url={myurl} preconnectHosts={myhosts} />;
```

## Interface

```typescript
export interface Props {
  url: string;

  /**
   * Additional hosts to preconnect to. These should be hosts that
   * are connected to by the page that will be loaded in an iframe.
   */
  preconnectHosts?: string[];
}
```
