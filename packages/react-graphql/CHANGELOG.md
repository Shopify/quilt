# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Replace Apollo declarative Query component with `useQuery` hook ([#1519](https://github.com/Shopify/quilt/pull/1519))

## [6.1.9] - 2020-05-14

### Changed

- Improve typings for `usePrefetch` to accept a `fetchPolicy` in `options` ([#1437](https://github.com/Shopify/quilt/pull/1437))

## [6.1.0] - 2020-03-13

- Update dependencies from `react-apollo` to `@apollo/react-common`, `@apollo/react-components`, and `@apollo/react-hooks` ([#1321](https://github.com/Shopify/quilt/pull/1321))

## [6.0.9] - 2020-02-27

### Changed

- Improve typings for `useBackgroundQuery` by allowing the `fetchPolicy` option. ([#1293](https://github.com/Shopify/quilt/pull/1293)).

## [6.0.7] - 2020-01-24

### Fixed

- Fixed when using `no-cache` fetch policy and data is undefined ([#1244](https://github.com/Shopify/quilt/pull/1244)).

## [6.0.0] - 2019-10-30

### Added

- Added a `createAsyncQuery` function that can create queries that are only loaded when executed ([#1153](https://github.com/Shopify/quilt/pull/1153)).

### Changed

- Improved typings to avoid cases where TypeScript allowed variables to be omitted incorrectly. These typings now require `react-apollo@3.x` ([#1153](https://github.com/Shopify/quilt/pull/1153)).

## [5.2.0] - 2019-10-07

### Changed

- Changed some type imports to fix type errors when using `react-apollo@3.x`. Projects that use 2.x may have some typing issues as changes were made to `react-apollo` that make it impossible to support the types for both versions. ([#1087](https://github.com/Shopify/quilt/pull/1087))

## [5.1.0] - 2019-09-05

### Added

- Adds support for `ssr=false` in `useQuery` ([951](https://github.com/Shopify/quilt/pull/951))

## [5.0.9] - 2019-08-29

### Fixed

- Fix SSR when using `cache-and-network` fetch policy with `useQuery` ([#928](https://github.com/Shopify/quilt/pull/928))

## [5.0.0] - 2019-08-20

### Changed

- Removed the `createGraphQLClient`/ `ApolloClient` exports, and instead export the tools to build an operation-tracking link (`createSsrExtractableLink`/ `SsrExtractableLink`). Projects using the `createGraphQLClient` utility to create a client with a `resolve` method can instead use the link and `SsrExtractableLink#resolveAll()` directly. ([#878](https://github.com/Shopify/quilt/pull/878))

## [4.0.4] - 2019-08-13

### Fixed

- Add missing dependencies ([832](https://github.com/Shopify/quilt/pull/832))

## [4.0.3] - 2019-07-07

### Added

- Adds SSR extractable link to support GraphQL Self-serialization ([810](https://github.com/Shopify/quilt/pull/810))

## [4.0.2] - 2019-07-05

### Fixed

- Using `useQuery` with `fetchPolicy` set to `no-cache` no longer runs during server renders (previously, using such a query would cause `extract` to loop indefinitely) ([#770](https://github.com/Shopify/quilt/pull/770))

## [4.0.1] - 2019-07-04

### Fixed

- Fixed an issue where `useBackgroundQuery` would not unsubscribe when options change

## [4.0.0] - 2019-07-03

### Changed

- Updated to depend on the 3.x version of `@shopify/react-async` ([#762](https://github.com/Shopify/quilt/pull/762))

## [3.4.1] - 2019-06-12

### Fixed

- `useQuery` now returns `undefined` instead of an empty object `{}` when there's no data ([#751](https://github.com/Shopify/quilt/pull/751))
- Fix re-wrapping query result under `current` key when using `no-cache` fetch policy (as a result of leaking implementation details, exposing `ref` object intead of what it is representing)

## [3.4.0] - 2019-05-31

- `fetchPolicy` is now compatible with `apollo-client@2.6.0`'s `WatchQueryFetchPolicy` options ([#729](https://github.com/Shopify/quilt/pull/729))

## [3.3.6] - 2019-05-31

### Fixed

- Queries are no longer waited on during server render when `skip` is `true` ([#726](https://github.com/Shopify/quilt/pull/726))
- The result of calling `useQuery` is now referentially stable when variables stay deep-equal between calls (previously, using a different object with the same values would change the result) ([#726](https://github.com/Shopify/quilt/pull/726)).

## [3.3.5] - 2019-05-29

### Fixed

- Fixed an issue where `useQuery` was watching a query even when `skip` was true ([#721](https://github.com/Shopify/quilt/pull/721))

## [3.3.4] - 2019-05-23

### Fixed

- Fixed an issue where `useQuery` with an async query component would not cause the query’s bundle to be included in the initial HTML.

## [3.3.3] - 2019-05-22

### Fixed

- Components created with `createAsyncQueryComponent` now call their `children` prop with a loading state while the query is still being fetched ([#707](https://github.com/Shopify/quilt/pull/707))

## [3.3.1] - 2019-05-15

- Fixed an issue where `useQuery` would not be performed during server renders ([#702](https://github.com/Shopify/quilt/pull/702))

## [3.2.0] - 2019-04-25

- Added `useQuery` and `useApolloClient` hooks ([#663](https://github.com/Shopify/quilt/pull/663))

## [3.1.0] - 2019-04-17

### Added

- Added `useMutation` hook ([#653](https://github.com/Shopify/quilt/pull/653))

## [3.0.0] - 2019-04-08

This library now requires React 16.8 because of changes to `@shopify/react-effect`.

## [1.3.0] - 2019-02-25

### Added

- You can now import `GraphQLData` and `GraphQLVariables` to extract the data or variable types from the component returned by `createAsyncQueryComponent` ([#529](https://github.com/Shopify/quilt/pull/529))

### Changed

- `AsyncQueryComponentType` now conforms to `graphql-typed`’s `GraphQLOperation` interface ([#529](https://github.com/Shopify/quilt/pull/529))

## [1.2.0] - 2019-02-15

### Added

- `createAsyncQueryComponent` now accepts a `defer` property that dictates whether that component should wait until mount or idle to start loading the query ([#517](https://github.com/Shopify/quilt/pull/517))
- The component returned from `createAsyncQueryComponent` and its static `Preload`, `Prefetch`, and `KeepFresh` components all accept an `async` prop that is an object with an optional `defer` property, which controls the way loading is done for just that element ([#517](https://github.com/Shopify/quilt/pull/517))

## [1.1.0] - 2019-02-10

### Added

- Added some additional generic types for extracting default from queries.

## [1.0.1] - 2019-02-10

- Fixed some broken API choices

## [1.0.0] - 2019-02-07

- Initial release
