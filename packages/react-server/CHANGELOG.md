# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2020-03-23

- Allow `assetName` to take a function for apps which need to serve multiple sub-apps based on path [[#1332]](https://github.com/Shopify/quilt/pull/1332)

## [0.9.0]

- Added `assetName` option to allow the `name` to be passed and default to `main`

## [0.8.5] - 2019-11-29

- Updated dependency: `@shopify/sewing-kit-koa@6.2.0`

## [0.8.0] - 2019-10-30

- `createRender` now includes automatic sewing-kit-koa set-up. The `createRender` middleware now accepts an `assetPrefix` that is passed to `sewingKitKoa`'s middleware. [[#1160](https://github.com/Shopify/quilt/pull/1160)]

## [0.7.3] - 2019-09-30

- Added missing `@shopify/react-cookie` dependency

## [0.7.0] - 2019-09-12

- Added universal cookies support using `@shopify/react-cookie`. [#1002](https://github.com/Shopify/quilt/pull/1002)

## [0.6.0] - 2019-09-12

- Sets a `Server-Timing` response header with the duration of a request [#990](https://github.com/Shopify/quilt/pull/990)

- New Providers utlities:

#### `createDefaultProvider()`

This function return a set of providers based on a given the of options.

#### `<DefaultProvider />`

A single component that renders all of the providers required within a typical React application.

## [0.5.1] - 2019-09-11

- Add spacing between "[React Server]" prefix and logs [#984](https://github.com/Shopify/quilt/pull/984)

## [0.5.0] - 2019-09-11

### Added

- Improved logger to provide more readable production logs in Splunk [#978](https://github.com/Shopify/quilt/pull/978)

## [0.4.0] - 2019-09-06

### Fixed

- Server rendering no longer fails with erroneous errors about missing AsyncAssetContext / NetworkContext values [#969](https://github.com/Shopify/quilt/pull/969)

### Added

- Add rendering of `HydrationContext` by default [#969](https://github.com/Shopify/quilt/pull/969)

## [0.3.1] - 2019-08-29

### Fixed

- Now includes the full error stack as well as the error message when presenting SSR errors in development [#901](https://github.com/Shopify/quilt/pull/901)

## [0.3.0] - 2019-08-28

### Added

- Added `Options` object as the second argument to `createRender()` allowing passed in values for `afterEachPass` and `betweenEachPass` [#911](https://github.com/Shopify/quilt/pull/911)

## [0.2.0]

### Changed

- `createRender` now passses the unchanged `Koa.Context` object.

## [0.1.6] - 2019-08-20

- actually passes in the headers from koa context into `NetworkManager`

## [0.1.5] - 2019-08-18

- logger middleware will fallback to `console` in render middleware

## [0.1.3]

### Changed

- Improve error experience in development when server rendering fails [#850](https://github.com/Shopify/quilt/pull/850)

## [0.1.0]

### Added

- `@shopify/react-server` package
