# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

- Added new types of builds (CommonJS, ESM, esnext, Node) for greater tree-shakability

## [1.2.0] - 2019-11-11

### Added

- Re-exports the new `createPlainWorkerFactory` function from `@shopify/web-worker` ([#1174](https://github.com/Shopify/quilt/pull/1174)).

## [1.1.0] - 2019-11-08

- You can now pass options as the second argument to `useWorker`. These options are forwarded as the [options to the worker creator](../web-worker#customizing-worker-creation) ([#1172](https://github.com/Shopify/quilt/pull/1172)).

## [1.0.4] - 2019-11-07

### Fixed

- `terminate` now properly terminates the worker ([#1166](https://github.com/Shopify/quilt/pull/1166/))).

## [1.0.0] - 2019-10-18

### Changed

- `createWorker` has been renamed to `createWorkerFactory` ([#1129](https://github.com/Shopify/quilt/pull/1129)).

## [0.0.1] - 2019-10-16

### Added

- `@shopify/react-web-worker` package
