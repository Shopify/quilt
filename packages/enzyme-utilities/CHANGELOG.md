# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.2.2] - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## [2.2.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [2.1.14] - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [2.1.12] - 2020-05-29

### Fixed

- Remove cast for `act` following update to `@types/react-dom`

## [2.1.11] - 2020-05-13

- `trigger` update the wrapper even if the promise is not resolved. [[#1439](https://github.com/Shopify/quilt/pull/1439)]

## [2.1.10] - 2020-05-13

- `trigger` now return the return value when the callback is a promise. [[#1434](https://github.com/Shopify/quilt/pull/1434)]

## [2.0.0] - 2019-03-28

### Changed

- `trigger` now runs the callback in a `react-dom` `act()` block, which prevents React warnings for synchronous updates resulting from calling a prop. This change means that the library now only supports React versions >=16.8 [[#612](https://github.com/Shopify/quilt/pull/612)]
