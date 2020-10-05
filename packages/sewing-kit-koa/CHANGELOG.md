# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [6.3.0] - 2020-02-03

### Fixed

- [Minor] If the requested locale is not found, and only locale-specific manifests exist, return the fallback locale's most polyfilled assets [#1253](https://github.com/Shopify/quilt/pull/1253)
- [Patch] If the requested variant locale is not found, the parent locale's manifest will be returned [#1254](https://github.com/Shopify/quilt/pull/1254)

## [6.2.0] - 2019-11-29

### Added

- [Minor] If an `assets.json.gz` file exists, it will be read and unzipped ([1199](https://github.com/Shopify/quilt/pull/1199))
- [Minor] Manifests may now contain an `identity` attribute; this contains extra metadata about a manifest's support (e.g., locales) ([1199](https://github.com/Shopify/quilt/pull/1199))
- [Minor] A `locale` can now be passed to `assets` / `asyncAssets` / `script` / `style` helpers. If a locale is provided, and manifests with a matching `identity.locales` array are found, locale-specific assets will be returned.
  - Note: use `@shopify/react-i18n` and its `from-generated-index` mode to create locale-specific builds

## [6.1.0] - 2019-07-17

- [Minor] Adds configurable path/to/assets.json as `manifestPath` in the middleware options ([794](https://github.com/Shopify/quilt/pull/794))

## [6.0.1] - 2019-07-10

### Fixed

- The library now loads scripts in development, even when only styles are requested. This fixes the fact that, in development, there are no explicit styles, and they are instead injected by the associated script. ([#782](https://github.com/Shopify/quilt/pull/782))

## [6.0.0] - 2019-07-03

### Changed

- Removed a number of unnecessary methods from `assets`, and allowed passing identifiers for async assets that can selectively omit styles or scripts ([#762](https://github.com/Shopify/quilt/pull/762))

## [5.0.0] - 2019-06-07

- **Breaking Change:** The `assets` property is now only accessible via a new function, `getAssets(ctx: Context)`, and set via `setAssets(ctx: Context, assets: Assets)`. [#743](https://github.com/Shopify/quilt/pull/743)

## [4.0.0] - 2019-06-05

### Breaking Change

- Updates middleware's manifest parsing to support manifest changes made in [`@shopify/sewing-kit`](https://github.com/Shopify/sewing-kit/pull/1265) [#740](https://github.com/Shopify/quilt/pull/740)
  - **Requires a minimum version of `@shopify/sewing-kit@0.86.0`**

## [3.3.0] - 2019-05-01

### Added

- Added a method for accessing the persisted GraphQL manifest produced by sewing-kit>=0.82.0 [#630](https://github.com/Shopify/quilt/pull/630)

## [3.2.0] - 2019-02-11

### Added

- Added methods for accessing all assets, all async assets, and only async scripts/ styles for more advanced use cases.

## [3.1.0] - 2019-02-10

### Added

- `Assets#styles` and `Assets#scripts` now accept an optional `asyncAssets` option, which will be used to embed additional async bundles into the returned list

## [3.0.0] - 2019-01-18

### Fixed

- Output middleware is now typed correctly as a basic koa middleware instead of requiring a custom koa context [#453](https://github.com/Shopify/quilt/pull/453)

## [3.0.0]

### Changed

- The `assetHost` option has been renamed to `assetPrefix` to make it more clear that you can supply a URL or path

## [2.0.1]

### Changed

- Updated the internal mechanism of resolving manifests

## [2.0.0]

### Changed

- The middleware now only supports the multi-client builds added in [version 0.68.0](https://github.com/Shopify/sewing-kit/pull/1096).

## [1.0.0]

Initial release
