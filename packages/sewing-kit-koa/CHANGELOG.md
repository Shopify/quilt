# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 4.0.0 - 2019-06-05

### Breaking change

- Updates middleware's manifest parsing to support manifest changes made in [`@shopify/sewing-kit`](https://github.com/Shopify/sewing-kit/pull/1265) [#740](https://github.com/Shopify/quilt/pull/740)
  - **Requires a minimum version of `@shopify/sewing-kit@0.86.0`**

## 3.3.0 - 2019-05-01

### Added

- Added a method for accessing the persisted GraphQL manifest produced by sewing-kit>=0.82.0 [#630](https://github.com/Shopify/quilt/pull/630)

## 3.2.0 - 2019-02-11

### Added

- Added methods for accessing all assets, all async assets, and only async scripts/ styles for more advanced use cases.

## 3.1.0 - 2019-02-10

### Added

- `Assets#styles` and `Assets#scripts` now accept an optional `asyncAssets` option, which will be used to embed additional async bundles into the returned list

## 3.0.0 - 2019-01-18

### Fixed

- Output middleware is now typed correctly as a basic koa middleware instead of requiring a custom koa context [#453](https://github.com/Shopify/quilt/pull/453)

## 3.0.0

### Changed

- The `assetHost` option has been renamed to `assetPrefix` to make it more clear that you can supply a URL or path

## 2.0.1

### Changed

- Updated the internal mechanism of resolving manifests

## 2.0.0

### Changed

- The middleware now only supports the multi-client builds added in [version 0.68.0](https://github.com/Shopify/sewing-kit/pull/1096).

## 1.0.0

Initial release
