# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The generated `ApolloClient` now automatically includes a `x-shopify-react-xhr: 1` header.

## [3.0.2] - 2020-02-27

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## [3.0.0] - 2020-01-24

### Changed

- Uses `@shopify/react-graphql@6.x`, which now requires `apollo-react@>=3.0.0` ([#1153](https://github.com/Shopify/quilt/pull/1153)).

## [2.0.4] - 2019-10-07

### Fixed

- Removed an unnecessary part of the `GraphQLUniversalProvider` component that broke when using `react-apollo@3.x` ([#1087](https://github.com/Shopify/quilt/pull/1087))

## [2.0.0] - 2019-09-13

- 🛑 Breaking change: `GraphQLUniversalProvider` expects a `createClientOptions` prop and will create ApolloClient using the options provided [#1039](https://github.com/Shopify/quilt/pull/1039)

## [1.1.0] - 2019-09-13

### Added

- By default included <ApolloBridge /> from [`@shopify/react-effect-apollo`](../react-effect-apollo). This is needed if the consumer is using `Query` component from `react-apollo` or `@shopify/react-graphql` ([#994](https://github.com/Shopify/quilt/pull/994))

## [1.0.0] - 2019-08-28

### Added

- `@shopify/react-graphql-universal-provider` package
