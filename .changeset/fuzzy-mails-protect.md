---
'@shopify/graphql-testing': major
---

Update Apollo from v2 to v3. Replace dependencies on `apollo-client`, `apollo-cache-inmemory` and `apollo-link` with `@apollo/client`. When updating to Apollo v3, `@shopify/graphql-persisted`, `@shopify/graphql-testing`, `@shopify/react-graphql` and `@shopify/react-graphql-universal-provider` should all be updated at the same time, and you should follow the [Apollo3 migration guide](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/).

Remove `assumeImmutableResults` and `unionOrIntersectionTypes` keys from `createGraphQLFactory()`'s options, as these concepts no longer exist in Apollo 3. Cache behavior can be controlled by setting values within the `cacheOptions` key, which is passed to [the cache constructor](https://www.apollographql.com/docs/react/caching/cache-configuration/#configuration-options). Use [`possibleTypes`](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#breaking-cache-changes) in place of `unionOrIntersectionTypes`.

Remove the ability to filter operations using `operationName` (e.g. graphQL.operations.all({operationName: 'SampleQuery'})`). Now operations must be filtered using `query`or`mutation` keys.

Add `graphQL.waitForQueryUpdates()` method to wait for batched cache updates that occur as of Apollo 3.6.0. This is useful if you need to await on the results of a `fetchMore` call.

Remove internal `TestingApolloClient` - use `ApolloClient` instead.

Apollo Change: The task/microtask resolution within Apollo has changed slightly, with some behaviors happening slightly later in the event loop than in Apollo 2. This has no visible effect in the browser, but `@shopify/graphql-testing` is very sensitive to these changes. To get some tests passing you may require additional task/microtask queue flushes.
