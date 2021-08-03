# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 4.1.1 - 2021-08-03

### Changed

- Update to latest sewiing-kit-next for build. Update `types`/`typeVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 4.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 4.0.2 - 2021-06-29

- No updates. Transitive dependency bump.

## 4.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 3.6.8 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 3.6.4 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 3.6.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 3.5.7 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 3.5.1 - 2020-06-22

### Fixed

- Fixes bug where empty cookies are still being set [#1517](https://github.com/Shopify/quilt/pull/1517)

## 3.5.0 - 2020-06-16

### Fixed

- Do not set `set-cookie` headers for incoming request cookies [#1515](https://github.com/Shopify/quilt/pull/1515)

## 3.4.0 - 2020-06-10

### Added

- Provide `NetworkUniversalProvider` component for universal access to network details. Currently only supports request headers. Previously `useRequestHeader` only had value on initial server-side renders

## 3.3.0

### Added

- The NetworkManager now accepts a `cookies` property in its constructor. This value is used to create a `ServerCookieManager` that can be accessed on the NetworkManger class instance. [#1002](https://github.com/Shopify/quilt/pull/1002)
- Added a new hook `useNetworkManager()` that returns the network manager. [#1002](https://github.com/Shopify/quilt/pull/1002)

## 3.2.0

- Added `useAcceptLanguage()` hook [#909](https://github.com/Shopify/quilt/pull/909)

## 3.1.10

### Fixed

- Store network headers in lowercase [#915](https://github.com/Shopify/quilt/pull/915)

## 3.1.2 - 2019-08-21

### Fixed

- `useRequestHeader` is now correctly case-insensitive [#889](https://github.com/Shopify/quilt/pull/8889)

## 3.1.1 - 2019-08-20

### Fixed

- `useRequestHeader` now works as documented when instantiated with `ctx.headers` [#888](https://github.com/Shopify/quilt/pull/888)

## 3.1.0 - 2019-06-14

### Added

- Added `useHeader` and `useRequestHeader` for interacting with network headers ([#747](https://github.com/Shopify/quilt/pull/747))

### Changed

- This library will now bail out of render passes in `react-effect` when a redirect is set ([#747](https://github.com/Shopify/quilt/pull/747))

## 3.0.4 - 2019-05-03

### Fixed

- Fixed a missing export for the `FrameSource` component ([#683](https://github.com/Shopify/quilt/pull/683))
- Fixed the `applyToContext` helper overwriting a content security policy when no directives were set ([#683](https://github.com/Shopify/quilt/pull/683))

## 3.0.0 - 2019-04-08

This library now requires React 16.8.

### Added

- Added hook versions of most component APIs: `useRedirect`, `useStatus`, and `useCspDirective` ([#547](https://github.com/Shopify/quilt/pull/547))

## 1.0.5

- Manual release

### Added

- `@shopify/react-network` package
