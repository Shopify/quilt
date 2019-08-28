# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## Fixed

- Store network headers in lowercase [#915](https://github.com/Shopify/quilt/pull/915)

## [3.1.2] - 2019-08-21

## Fixed

- `useRequestHeader` is now correctly case-insensitive [#889](https://github.com/Shopify/quilt/pull/8889)

## [3.1.1] - 2019-08-20

## Fixed

- `useRequestHeader` now works as documented when instantiated with `ctx.headers` [#888](https://github.com/Shopify/quilt/pull/888)

## [3.1.0] - 2019-06-14

### Added

- Added `useHeader` and `useRequestHeader` for interacting with network headers ([#747](https://github.com/Shopify/quilt/pull/747))

### Changed

- This library will now bail out of render passes in `react-effect` when a redirect is set ([#747](https://github.com/Shopify/quilt/pull/747))

## [3.0.4] - 2019-05-03

### Fixed

- Fixed a missing export for the `FrameSource` component ([#683](https://github.com/Shopify/quilt/pull/683))
- Fixed the `applyToContext` helper overwriting a content security policy when no directives were set ([#683](https://github.com/Shopify/quilt/pull/683))

## [3.0.0] - 2019-04-08

This library now requires React 16.8.

### Added

- Added hook versions of most component APIs: `useRedirect`, `useStatus`, and `useCspDirective` ([#547](https://github.com/Shopify/quilt/pull/547))

## [1.0.5]

- Manual release

### Added

- `@shopify/react-network` package
