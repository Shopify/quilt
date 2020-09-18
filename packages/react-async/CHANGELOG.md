# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

- Removed dependency on deprecated `@shopify/javascript-utilities` package ([#1560](https://github.com/Shopify/quilt/pull/1560))

## [3.1.16] - 2020-05-01

### Fixed

- Fixed a type issue with `usePreload`, `usePrefetch`, and `useKeepFresh` hook arguments ([#1404](https://github.com/Shopify/quilt/pull/1404))

## [3.1.0] - 2019-10-30

### Added

- Exported some additional types that can be useful for creating objects that can be used with `usePreload`, `usePrefetch`, and `useKeepFresh` ([#1153](https://github.com/Shopify/quilt/pull/1153)).

## [3.0.1] - 2019-07-04

### Fixed

- Fixed an issue where async components would not be immediately available during server rendering
- Added the missing dependencies for `@shopify/react-idle` and `@shopify/react-hydrate`

## [3.0.0] - 2019-07-03

Complete rewrite to support progressive hydration and hook-based prefetching. Please refer to the [migration guide](./documentation/migrations.md) for details.

## [2.3.0] - 2019-05-22

### Added

- Prefetching now happens on `touchdown` to improve perceived performance on touch devices ([#708](https://github.com/Shopify/quilt/pull/708))

## [2.2.0] - 2019-05-15

- Added a `useAsyncAsset` hook to register an identifier as used when not directly using the `Async` component ([#702](https://github.com/Shopify/quilt/pull/702))

## [2.1.0] - 2019-04-12

- Small refactor to export `resolve` utility ([#649](https://github.com/Shopify/quilt/pull/649))

## [2.0.0] - 2019-04-08

This library now requires React 16.8 because of changes to `@shopify/react-effect`.

## [1.3.0] - 2019-03-25

### Added

- Support the new `DeferTiming.InViewport` strategy ([#576](https://github.com/Shopify/quilt/pull/576))

## [1.2.2] - 2019-02-27

### Fixed

- The library now performs a more exhaustive obfuscation of `require` to reliably fool Webpack ([#537](https://github.com/Shopify/quilt/pull/537))

## [1.2.1] - 2019-02-26

### Fixed

- Fixed an issue where Webpack would complain about a dynamic `require` statement ([#533](https://github.com/Shopify/quilt/pull/533))

## [1.2.0] - 2019-02-25

### Changed

- `Async` now attempts to resolve the `id` of the component with a bare `require` call when it is available ([#530](https://github.com/Shopify/quilt/pull/530))

## [1.1.0] - 2019-02-15

### Added

- `createAsyncComponent` now accepts a `defer` property that dictates whether that component should wait until mount or idle to start loading the component ([#517](https://github.com/Shopify/quilt/pull/517))
- The component returned from `createAsyncComponent` and its static `Preload`, `Prefetch`, and `KeepFresh` components all accept an `async` prop that is an object with an optional `defer` property, which controls the way loading is done for just that element ([#517](https://github.com/Shopify/quilt/pull/517))

## [1.0.2] - 2019-02-10

### Fixed

- Fixed an issue where the `<Prefetcher />` would not watch user interactions by default.

## [1.0.1] - 2019-02-10

- Fixed some broken API choices

## [1.0.0] - 2019-02-07

- Initial release
