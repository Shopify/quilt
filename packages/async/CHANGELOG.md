# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

- Added new types of builds (CommonJS, ESM, esnext, Node) for greater tree-shakability

## [2.1.0] - 2019-10-30

### Added

- Added `createAsyncQuery` to the list of default transforms ([#1153](https://github.com/Shopify/quilt/pull/1153))

### Fixed

- Patch: Documentation typo fix in README.md ([842](https://github.com/Shopify/quilt/pull/842))

## [2.0.0] - 2019-07-03

### Added

- Moved several module resolving features to this library from `react-async` ([#762](https://github.com/Shopify/quilt/pull/762))

## [1.3.0] - 2019-03-25

### Added

- `DeferTiming` now includes an `InViewport` strategy ([#576](https://github.com/Shopify/quilt/pull/576))

## [1.2.0] - 2019-03-11

### Added

- Added a `DeferTiming` enum for shared defer strategies ([#561](https://github.com/Shopify/quilt/pull/561))

## [1.1.0] - 2019-02-25

### Added

- Added a `webpack` option to disable the Webpack-specific transform ([#530](https://github.com/Shopify/quilt/pull/530))
