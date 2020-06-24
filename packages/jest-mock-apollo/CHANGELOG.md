# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

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
