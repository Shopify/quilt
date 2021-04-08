# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.24 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.0 - 2019-11-11

### Added

- Re-exports the new `createPlainWorkerFactory` function from `@shopify/web-worker` ([#1174](https://github.com/Shopify/quilt/pull/1174)).

## 1.1.0 - 2019-11-08

- You can now pass options as the second argument to `useWorker`. These options are forwarded as the [options to the worker creator](../web-worker#customizing-worker-creation) ([#1172](https://github.com/Shopify/quilt/pull/1172)).

## 1.0.4 - 2019-11-07

### Fixed

- `terminate` now properly terminates the worker ([#1166](https://github.com/Shopify/quilt/pull/1166/))).

## 1.0.0 - 2019-10-18

### Changed

- `createWorker` has been renamed to `createWorkerFactory` ([#1129](https://github.com/Shopify/quilt/pull/1129)).

## 0.0.1 - 2019-10-16

### Added

- `@shopify/react-web-worker` package
