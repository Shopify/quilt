# `@shopify/admin-graphql-api-utilities`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/admin-graphql-api-utilities.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/admin-graphql-api-utilities.svg)

A set of utilities to use when consuming Shopify’s admin GraphQL API.

## Installation

```bash
$ yarn add @shopify/admin-graphql-api-utilities
```

## API Reference

### `parseGidType(gid: string): string`

Given a Gid string, parse out the type.

#### Example Usage

```typescript
import {parseGidType} from '@shopify/admin-graphql-api-utilities';

parseGidType('gid://shopify/Customer/12345');
// → 'Customer'
```

### `function parseGid(gid: string): string`

Given a Gid string, parse out the id.

#### Example Usage

```typescript
import {parseGid} from '@shopify/admin-graphql-api-utilities';

parseGid('gid://shopify/Customer/12345');
// → '12345'
```

### `function parseGidWithParams(gid: string): ParsedGid`

Given a Gid string, parse out the id and its params.

#### Example Usage

```typescript
import {parseGidWithParams} from '@shopify/admin-graphql-api-utilities';

parseGidWithParams('gid://shopify/Customer/12345?sessionId=123&foo=bar');
// → {
//     id: '12345',
//     params: {sessionId: '123', foo: 'bar'}
//   }
```

### `function composeGidFactory(namespace: string): Function`

Create a new `composeGid` with a given namespace instead of the default `shopify` namespace.

#### Example Usage

```typescript
import {composeGidFactory} from '@shopify/admin-graphql-api-utilities';

const composeGid = composeGidFactory('CustomApp');

composeGid('Product', '123');
// → 'gid://CustomApp/Product/123'
```

### `function composeGid(key: string, id: number | string, params: Record<string, string> = {}): string`

Given a key and id, compose a Gid string.

#### Example Usage

```typescript
import {composeGid} from '@shopify/admin-graphql-api-utilities';

composeGid('Customer', 12345);
// → 'gid://shopify/Customer/12345'

composeGid('Customer', '67890', {foo: 'bar'});
// → 'gid://shopify/Customer/67890?foo=bar'
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
