# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [4.2.0] - 2020-06-24

### Changed

- Add subsequential request mocking support ([#1534](https://github.com/Shopify/quilt/pull/1534))

## [4.1.0] - 2020-04-20

### Changed

- Update `graphql` dependencies [[#1379](https://github.com/Shopify/quilt/pull/1379)]
- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]
- Update `jest-matcher-utils` to `25` [[#1375](https://github.com/Shopify/quilt/pull/1375)]

## [4.0.9] - 2019-12-04

### Fixed

- Adding `TestingApolloClient` to fix scenarios where some `fetchPolicy` values produce React events firing outside of an `act` scope ([#1198](https://github.com/Shopify/quilt/pull/1198))

## [4.0.0] - 2019-07-03

### Changed

- Updated to respect the new asynchronous query components from the 4.x version of `@shopify/react-graphql` ([#762](https://github.com/Shopify/quilt/pull/762))

## [3.2.0] - 2019-06-27

### Added

- Allow `MockLink` to return a full GraphQLError. ([#768](https://github.com/Shopify/quilt/pull/768))

## [3.1.0] - 2019-05-22

### Added

- Added a new entry point, `@shopify/graphql-testing/matchers`, which includes a `toHavePerformedGraphQLOperation` assertion ([#706](https://github.com/Shopify/quilt/pull/706))
- Improved filtering GraphQL operations by allowing you to pass `query` or `mutation` options ([#706](https://github.com/Shopify/quilt/pull/706))

## [3.0.1] - 2019-04-02

### Changed

- Loosened version requirements for Apollo dependencies

## [3.0.0] - 2019-04-01

### Changed

- `createGraphQLFactory` is now a named export, not the default export ([#623](https://github.com/Shopify/quilt/pull/623/))
- Simplified much of the external workings of the library, including removing the custom subclass of `ApolloClient` ([#623](https://github.com/Shopify/quilt/pull/623/))

## [1.0.0]

Initial release.
