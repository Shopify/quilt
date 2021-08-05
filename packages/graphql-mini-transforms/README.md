# `graphql-mini-transforms`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/graphql-mini-transforms.svg)](https://badge.fury.io/js/graphql-mini-transforms.svg)

Transformers for importing .graphql files in various build tools.

## Installation

```bash
$ yarn add graphql-mini-transforms
```

## Usage

### Webpack

This package provides a loader for `.graphql` files in Webpack. This loader automatically minifies and adds a unique identifier to each GraphQL document. These features are used by [`@shopify/webpack-persisted-graphql-plugin`](https://github.com/Shopify/sewing-kit/tree/main/packages/webpack-persisted-graphql-plugin) to generate a mapping of identifiers to GraphQL operations for persisted queries.

To use this loader in Webpack, add a rule referencing this loader to your Webpack configuration:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        use: 'graphql-mini-transforms/webpack',
        exclude: /node_modules/,
      },
    ],
  },
};
```

Note that, unlike [`graphql-tag/loader`](https://github.com/apollographql/graphql-tag#webpack-preprocessing-with-graphql-tagloader), this loader does not currently support exporting multiple operations from a single file. You can, however, import other GraphQL documents containing fragments with `#import` comments at the top of the file:

```graphql
#import './ProductVariantPriceFragment.graphql';

query Product {
  product {
    variants(first: 10) {
      edges {
        node {
          ...ProductVariantId
          ...ProductVariantPrice
        }
      }
    }
  }
}

fragment ProductVariantId on ProductVariant {
  id
}
```

#### Options

This loader accepts a single option, `simple`. This option changes the shape of the value exported from `.graphql` files. By default, a `graphql-typed` `DocumentNode` is exported, but when `simple` is set to `true`, a `SimpleDocument` is exported instead. This representation of GraphQL documents is smaller than a full `DocumentNode`, but generally won’t work with normalized GraphQL caches.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        use: 'graphql-mini-transforms/webpack',
        exclude: /node_modules/,
        options: {simple: true},
      },
    ],
  },
};
```

If this option is set to `true`, you should also use the `jest-simple` transformer for Jest, and the `--export-format simple` flag for `graphql-typescript-definitions`.

### Jest

This package also provides a transformer for GraphQL files in Jest. To use the transformer, add a reference to it in your Jest configuration’s `transform` option:

```js
module.exports = {
  transform: {
    '\\.(gql|graphql)$': 'graphql-mini-transforms/jest',
  },
};
```

If you want to get the same output as the `simple` option of the webpack loader, you can instead use the `jest-simple` loader transformer:

```js
module.exports = {
  transform: {
    '\\.(gql|graphql)$': 'graphql-mini-transforms/jest-simple',
  },
};
```

## Prior art

This loader takes heavy inspiration from the following projects:

- [`graphql-tag`](https://github.com/apollographql/graphql-tag) and [`graphql-persisted-document-loader`](https://github.com/leoasis/graphql-persisted-document-loader)
- [`graphql-loader`](https://github.com/samsarahq/graphql-loader)

We wrote something custom in order to get the following benefits:

- Significantly smaller output with no runtime
- Automatically-generated document identifiers

## Related projects

- [next-plugin-mini-graphql](https://www.npmjs.com/package/next-plugin-mini-graphql) - Provides [Next.js](https://nextjs.org/) support for `.graphql` files using `graphql-mini-transforms`
