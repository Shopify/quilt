# `@shopify/react-effect-apollo`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-effect-apollo.svg)](https://badge.fury.io/js/%40shopify%2Freact-effect-apollo.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-effect-apollo.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-effect-apollo.svg)

A bridging layer between react-apollo and react-effect.

## Installation

```bash
$ yarn add @shopify/react-effect-apollo
```

## Usage

`react-apollo` exposes a function, `getDataFromTree`, which performs a sequence of tree traversals to resolve GraphQL data. This can be wasteful in situations where you are already traversing the tree for other purposes, like resolving translations in `@shopify/react-i18n`, or extracting network details in `@shopify/react-network`. This package provides a way of resolving Apollo’s data with just a single call of `@shopify/react-effect`’s `extract()` function, which will also extract all other server details from packages using `@shopify/react-effect`.

To use this package, create a new "bridge" component from the exposed `createApolloBridge` function in your server code. Then, wrap this bridge around your application when calling `extract()`. That’s all there is to it!

```tsx
import {renderToString} from 'react-dom/server';
import ApolloClient from 'apollo-client';
import {createApolloBridge} from '@shopify/react-effect-apollo';
import {extract} from '@shopify/react-effect/server';
import App from './App';

export async function middleware(ctx) {
  const client = new ApolloClient /* client config */();
  const ApolloBridge = createApolloBridge();
  const app = <App apolloClient={client} />; // or however you pass your client

  await extract(app, {
    render(element) {
      return <ApolloBridge>{element}</ApolloBridge>;
    },
  });

  ctx.body = renderToString(app);
}
```

### Options

`createApolloBridge` accepts the following options:

- `inflightQueryBehavior`: a member of the `InflightQueryBehavior` enum, which is exported from this package. Can be either `InflightQueryBehavior.RenderSubtree`, which will render the entire tree, including children of Apollo `Query` components that have not been resolved yet, or `InflightQueryBehavior.SkipSubtree`, which will return `null` from `Query` components until their data is fetched.

  The default is to render the entire tree, which is consistent with how Apollo works on the client but may lead to unnecessary queries being run. `InflightQueryBehavior.SkipSubtree` is the default behavior for Apollo’s built-in `getDataFromTree`.
