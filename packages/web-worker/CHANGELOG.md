# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [1.2.0] - 2019-11-08

### Changed

- Uses the new `@shopify/rpc` library for communication with the worker.

### Added

- You can now supply an optional options object to the `createWorkerFactory` functions. One option is currently supported: `createMessenger`, which allows you to customize the message channel for the worker.
- To support creating workers that are not treated as same-origin, the library now provides a `createIframeWorkerMessenger` function. This function is passed to the new `createMessenger` API, and works by creating a message channel directly from the host page to a worker in a sandboxed `iframe`.

## [1.1.0] - 2019-10-21

### Added

- Multiple workers in a single app now get unique names automatically, and can provide an explicit name for the worker file using the `webpackChunkName` comment ([#1132](https://github.com/Shopify/quilt/pull/1132))

## [1.0.1] - 2019-10-18

### Fixed

- `terminate()` now releases the script created with `URL.createObjectURL()` alongside terminating the worker.

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
