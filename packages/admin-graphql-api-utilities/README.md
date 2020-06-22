# `@shopify/admin-graphql-api-utilities`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/admin-graphql-api-utilities.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/admin-graphql-api-utilities.svg)

A set of utilities to use when consuming Shopify’s admin GraphQL API.

## Installation

```bash
$ yarn add @shopify/admin-graphql-api-utilities
```

## API Reference

### `function parseGid(gid: string): string`

Given a Gid string, parse out the id.

#### Example Usage

```typescript
import {parseGid} from '@shopify/admin-graphql-api-utilities';

parseGid('gid://shopify/Customer/12345');
// → '12345'
```

### `function composeGid(key: string, id: number | string): string`

Given a key and id, compose a Gid string.

#### Example Usage

```typescript
import {composeGid} from '@shopify/admin-graphql-api-utilities';

composeGid('Customer', 12345);
// → 'gid://shopify/Customer/12345'

composeGid('Customer', '67890');
// → 'gid://shopify/Customer/67890'
```

### `function nodesFromEdges(edges)`

Given an array of edges, return the nodes.

#### Example Usage

```typescript
import {nodesFromEdges} from '@shopify/admin-graphql-api-utilities';

nodesFromEdges([
  {node: {id: '1', title: 'title one'}},
  {node: {id: '2', title: 'title two'}},
]);
// → [{id: '1', title: 'title one'}, {id: '2', title: 'title two'}]
```

### `function keyFromEdges(edges, key)`

Given an array of edges, return a new array of only the specific key from those nodes.

#### Example Usage

```typescript
import {keyFromEdges} from '@shopify/admin-graphql-api-utilities';

keyFromEdges(
  [
    {node: {id: '1', title: 'title one'}},
    {node: {id: '2', title: 'title two'}},
  ],
  'title',
);
// → ['title one', 'title two']
```
