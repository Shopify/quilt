# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [5.1.2] - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## [5.1.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [5.0.1] - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [5.0.0] - 2020-06-24

### Fixed

- Mock client now throws useful errors and fails tests when required mocks are not provided

## [4.0.6] - 2020-03-13

- Update dev dependencies from `react-apollo` to `@apollo/react-common` and `@apollo/react-hoc` ([#1321](https://github.com/Shopify/quilt/pull/1321))

## [4.0.0] - 2019-10-25

### Added

- Remove `ssrMode` option from `configureClient`. ([#1146](https://github.com/Shopify/quilt/pull/1146))

## [3.1.0] - 2019-06-27

### Added

- Allow `MockApolloLink` to return a full GraphQLError. ([#768](https://github.com/Shopify/quilt/pull/768))
