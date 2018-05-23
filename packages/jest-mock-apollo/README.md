# `@shopify/jest-mock-apollo`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo)

Jest + Enzyme mocks for Apollo 2.x.

## Installation

```bash
$ yarn add @shopify/jest-mock-apollo
```

## Setup

This package provides a function `createGraphQLClientFactory` that can be used to instantiate a `createGraphQLClient` function specific to your project:

```ts
// tests/utilities/graphql.ts
import createGraphQLClientFactory from '@shopify/jest-mock-apollo';

// You likely want to import this from somewhere in real production code
const schemaSrc = `
  type Product {
    id: Int!
    title: String
  }

  type Query {
    products: [Product]
  }
`;

const createGraphQLClient = createGraphQLClientFactory({
  schemaSrc,
});

export {createGraphQLClient};
```

The factory requires a `GraphQLSchema`, either directly via `schema` or as a source string via `schemaSrc`, in order to ensure that more useful error messages are shown and that mocks are validated against the schema.

## Example Usage

Take a look at the test suite for examples on how to use enzyme's mock context.

## API Reference

See the comments and TypeScript annotations in the code for details on the provided utilities.
