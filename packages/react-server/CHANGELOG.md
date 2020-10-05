# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [0.18.0] - 2019-08-18

### Changed

- Allow `proxy` option to be specified by webpack plugin config (and forwarded to `createServer`). ([#1598](https://github.com/Shopify/quilt/pull/1598))

## [0.17.0] - 2019-08-18

### Added

- Add request_id, hostname, and ips as part of the log. ([#1579](https://github.com/Shopify/quilt/pull/1579)).

### Changed

- Change createServer default ip from `localhost` to `0.0.0.0` and remove 3000 as a default port. ([#1585](https://github.com/Shopify/quilt/pull/1585))

- Allow `proxy` and `app` options to be passed to `createServer`. ([#1591](https://github.com/Shopify/quilt/pull/1591))

## [0.16.0] - 2020-06-16

### Changed

- Move default options from webpack plugin into react-server. ([#1514](https://github.com/Shopify/quilt/pull/1514))

## [0.15.0] - 2020-06-06

### Changed

- 🛑 Replace `isomorphic-fetch` with `cross-fetch` as peer dependency. Consumer project should install `cross-fetch` in their project or use `@shopify/sewing-kit >= v0.131.0` ([#1497](https://github.com/Shopify/quilt/pull/1497))

## [0.14.0] - 2020-06-06

### Added

- Added `renderError` option to rendering a custom Error page on production SSR errors.

  - Note: If `renderError` is not set, the server returns a fallback error page as a sane default for production SSR errors.

- [webpack-plugin] Utilizes an `error` component if it exists at the root of `app/ui`. This component will be imported in the server source and passed to `@shopify/react-server`'s `renderError` option when creating a server. This will also create a virtual client entrypoint for the `error` component.

## [0.13.0] - 2020-06-04

### Changed

- Move `react-server-webpack-plugin` into `react-server` and expose it from `@shopify/react-server/webpack-plugin` ([#1489](https://github.com/Shopify/quilt/pull/1489))

## [0.12.0] - 2020-05-12

### Changed

- The `x-quilt-data` header is now serialized under the ID `quilt-data` rather than `x-quilt-data`

## [0.11.0] - 2020-05-04

### Changed

- Removed the providers that were previously exported. To our knowledge nothing used them and they offered little value. If cookie context is needed users can manually use `CookieUniversalProvider` from `@shopify/react-cookie`, and `CSRFProvider` should not be necessary with the new strategies provided by `quilt_rails`.

- Add: Serialize `x-quilt-data` received from the Rails server for use on the client ([#1411](https://github.com/Shopify/quilt/pull/1411))

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
