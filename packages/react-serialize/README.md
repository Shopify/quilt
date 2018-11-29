# `@shopify/react-serialize`

**Note**: This module is now deprecated. You should move to using the serialization features of [`@shopify/react-html`](../react-html) instead.

---

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-serialize.svg)](https://badge.fury.io/js/%40shopify%2Freact-serialize) ![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-serialize.svg)

Provides an idiomatic way to serialize data for rehydration in a universal react application.

## Installation

```bash
$ yarn add @shopify/react-serialize
```

## Usage

On the server, the `<Serializer />` component will serialize whatever you pass as it's `data` prop.

```javascript
// in your server renderer
import {Serializer} from '@shopify/react-serialize';

...

const apolloState = getDatafromTree(appMarkup)

const markup = react.renderToString(
  <React.Fragment>
    {appMarkup}
    <Serializer id="apollo-data" data={apolloState}>
  </React.Fragment>
);
```

Then on the client, you can use `getSerialized` to fetch that data out of the DOM and initialize whatever you need.

```javascript
// when you are rehydrating on the client
import {getSerialized} from '@shopify/react-serialize';
import ApolloClient from 'apollo-client';

...

const {data: initialApolloData} = getSerialized('apollo-data');
const client = new ApolloClient({
  ...myConfig,
  cache: cache.restore(initialApolloData),
});
```
