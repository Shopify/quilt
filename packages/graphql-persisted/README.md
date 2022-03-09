# `@shopify/graphql-persisted`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fgraphql-persisted.svg)](https://badge.fury.io/js/%40shopify%2Fgraphql-persisted.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/graphql-persisted.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/graphql-persisted.svg)

Apollo and Koa integrations for [persisted GraphQL queries](https://blog.apollographql.com/persisted-graphql-queries-with-apollo-client-119fd7e6bba5).

## Installation

```bash
$ yarn add @shopify/graphql-persisted
```

## Usage

This package includes two parts, both of which must be used together in order to make persisted GraphQL queries:

- An Apollo link that knows how to add persisted document IDs to an operation, and interpret server responses indicating that a persisted query was not found
- A Koa middleware that knows how to extract a persisted document ID and fetch the full document body

### Apollo

The `@shopify/graphql-persisted/apollo` entrypoint exports a `createPersistedLink` function. This function returns an [Apollo link](https://www.apollographql.com/docs/link/) which should be added _before_ the HTTP link:

```tsx
import {ApolloClient, ApolloLink, createHttpLink} from '@apollo/client';
import {createPersistedLink} from '@shopify/graphql-persisted/apollo';

const client = new ApolloClient({
  /* other options, like the cache */
  link: ApolloLink.from([createPersistedLink(), createHttpLink()]),
});
```

This function accepts an optional `options` object. The following options are available:

- `idFromOperation?(operation: Operation): string | undefined | null`: calculates the unique ID to use for the persisted query, which will eventually be passed to the server’s `cache#get` method to retrieve the full query body. If omitted, this option will default to pulling the `id` field off of the `operation.query` `DocumentNode`, which works well in combination with documents compiled using [`graphql-mini-transforms`](https://github.com/Shopify/graphql-tools-web/tree/main/packages/graphql-mini-transforms) (used by default in sewing-kit).
- `alwaysIncludeQuery: boolean`: always include the GraphQL query in a request, instead of the default behavior where the query is only included if the server does not recognize the persisted query ID. This is useful for debugging, and can avoid extra round trips in an SSR environment.

The behavior of this link when a persisted query is not found for a particular ID depends on the `cacheMissBehavior` passed to your server middleware, which is documented below.

### Koa

The Koa middleware from this package will parse the request body, extract the ID, and attempt to resolve it to a full document body, replacing the request body’s `query` field if a match is found. You can construct this middleware with the following options:

- `cache`: A cache object with a `get` and `set` method (both of which can be asynchronous). You can use this option to store and retrieve persisted documents from a dedicated store like Redis.
- `cacheMissBehavior`: A member of the exported `CacheMissBehavior` enum. This dictates how the system will handle cases where a full document body could not be retrieved for an ID. The default is `CacheMissBehavior.SendAlways`.

```tsx
import Koa from 'koa';
import redisStore from 'koa-redis';
import {
  createPersistedGraphQLMiddleware,
  CacheMissBehavior,
} from '@shopify/graphql-persisted/koa';

const app = new Koa();

// We'll use koa-redis since we probably use redis for sessions,
// too. You can use any store you want, though.
const redis = redisStore();

app.use(
  createPersistedGraphQLMiddleware({
    cache: redis,
    cacheMissBehavior: CacheMissBehavior.SendAndStore,
  }),
);

// additional code, including whatever middleware will actually
// handle the GraphQL query
```

When the middleware attempts to resolve an ID to a query document, it attempts to do the following:

- If `ctx.state.assets.graphQLSource` exists, call it and wait on the result. If a result is found and a cache option was provided when creating the middleware, return the result _and_ save it to the cache using `cache.set`. This step makes it automatic to get persisted queries going for apps using sewing-kit and [`@shopify/sewing-kit-koa`](https://github.com/Shopify/quilt/tree/main/packages/sewing-kit-koa).
- If a cache is present, call `cache.get` with the ID and wait on the result.

If no value was found during this process, the GraphQL call will fail in a way determined by the `cacheMissBehavior` option:

- `CacheMissBehavior.SendAlways` (default): the server will respond to the client with an error that tells it to always send the full query document for operations with that ID. It will never attempt to store those documents in the cache. The query that had this error will be immediately retried before calling the remaining Apollo links in the chain.
- `CacheMissBehavior.SendAndStore`: the server will respond to the client with an error that tells it to send the full query document on an immediate retry. The server will then store that value in the cache against the ID. Subsequent calls will once again only send the ID.
- `CacheMissBehavior.Error`: the server will respond to the client with an error, and no retry will be performed.

These options provide you full control over the behavior of clients sending persisted queries you do not recognize. If you use sewing-kit and want to get persisted queries only for the "current" set of queries, but want to allow old queries to still work, use `SendAlways`. If you want to maximize the performance benefit of persisted queries, use `SendAndStore`. Finally, if you want to prevent queries that have not already been persisted, use `Error`.
