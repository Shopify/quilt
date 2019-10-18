# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [1.0.0] - 2019-10-18

### Changed

- `createWorker` has been renamed to `createWorkerFactory` ([#1129](https://github.com/Shopify/quilt/pull/1129)).

### Fixed

- Fixed additional issues with `retain` and `release` on deep structures ([#1129](https://github.com/Shopify/quilt/pull/1129)).

## [0.0.8] - 2019-10-18

### Fixed

- `createWorker` now works correctly when the webpack build uses only a pathname for `output.publicPath` ([#1126](https://github.com/Shopify/quilt/pull/1126)).
- `retain` and `release` now correctly deeply retain/ release objects and arrays.

## [0.0.4] - 2019-10-15

### Added

- `createWorker` now falls back to using the module directly in cases (like the test environment) where the value is not transformed into a script URL ([#1113](https://github.com/Shopify/quilt/pull/1113))
- `@shopify/web-worker/babel` now supports a `noop` mode (for generating a noop worker in environments that don’t support `Worker`, like the server) and properly restricts transformations to only relevant packages ([#1112](https://github.com/Shopify/quilt/pull/1112))

## [0.0.1] - 2019-10-07

Initial (pre-)release.
