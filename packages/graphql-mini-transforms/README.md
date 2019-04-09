# `graphql-mini-transforms`

> Transformers for importing .graphql files in various build tools.

## Installation

```
npm install graphql-mini-transforms --save-dev
```

or, with Yarn:

```
yarn add graphql-mini-transforms --dev
```

## Usage

### Webpack

This package provides a loader for `.graphql` files in Webpack. This loader automatically minifies and adds a unique identifier to each GraphQL document. These features are used by [`@shopify/webpack-persisted-graphql-plugin`](https://github.com/Shopify/sewing-kit/tree/master/packages/webpack-persisted-graphql-plugin) to generate a mapping of identifiers to GraphQL operations for persisted queries.

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

### Jest

This package also provides a transformer for GraphQL files in Jest. To use the transformer, add a reference to it in your Jest configuration’s `transform` option:

```js
module.exports = {
  transform: {
    '\\.(gql|graphql)$': 'graphql-mini-transforms/jest',
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
