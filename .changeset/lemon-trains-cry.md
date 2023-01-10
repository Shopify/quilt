---
'@shopify/react-graphql': major
---

Update Apollo from v2 to v3. Replace dependencies on `apollo-client`, `apollo-cache-inmemory`, `apollo-link`, `@apollo/react-common` and `@apollo/react-hooks` with `@apollo/client`. When updating to Apollo v3, `@shopify/graphql-persisted`, `@shopify/graphql-testing`, `@shopify/react-graphql` and `@shopify/react-graphql-universal-provider` should all be updated at the same time, and you should follow the [Apollo3 migration guide](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/), and note any breaking changes in the [Apollo3 changelog](https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-300), paying particular attention to changes around import paths and cache behavior.

Update the return type of `useMutation` to `FetchResult` to align it with what the Apollo client returns. The `data` key that gets returned from calling the function returned by `useMutation` may now be `undefined` in addition to possibly being `null`.

Apollo Change: `ApolloClient.{query,mutate,etc}` now have built-in type inference. We suggest enabling `graphql-typescript-definitions`'s `--export-format=documentWithTypedDocumentNode` option to generate `.graphql.d.ts` files that produce types that Apollo's own client and hooks can take advantage of.

Apollo Change: `useQuery().errors`, `useMutation().errors` and other error arrays are now readonly arrays (i.e. `readonly GraphQLError[]`). Previously they returned mutable arrays (i.e. `GraphQLError[]`).

Apollo Change: The message of `ApolloError` Error instances are no longer prefixed with `GraphQL Error:` or `Network Error:`.

Apollo Change: The value of a complete but empty `data` payload is now `undefined`, in Apollo 2 it was an empty object (i.e. `{}`). Complete but empty data can occur if you have a query that uses the `@include` directive that results in you requesting an empty query, for instance `query PetQuery($includePets: Boolean! = false) { pets @include(if: $includePets) { name } }`.

Apollo Change: In Apollo 2 making a query with the `fetchPolicy: 'cache-and-network'` option also seemed to imply setting [`notifyOnNetworkStatusChange: true`](https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states), and thus if you called `fetchMore` on that query then the loading state would be updated. In Apollo 3 this side-effect is no longer present. If you want a query to update its loading state after calling `fetchMore` then you must explicitly set the `notifyOnNetworkStatusChange: true` option.
