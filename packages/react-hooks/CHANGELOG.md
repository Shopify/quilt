# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [1.11.1] - 2020-08-19

### Fixed

- `useDelayedCallback` now uses `useRef` instead of `useState` in to avoid unnecessary re-render ([#1600](https://github.com/Shopify/quilt/pull/1600))
- Improved test case for `useDelayedCallback` ([#1601](https://github.com/Shopify/quilt/pull/1601))

## [1.11.0] - 2020-08-18

### Added

- Added `useDelayedCallback` hook ([#1595](https://github.com/Shopify/quilt/pull/1595))

## [1.10.0] - 2020-05-14

### Added

- Added `useForceUpdate` hook ([#1441](https://github.com/Shopify/quilt/pull/1441))

## [1.9.1] - 2020-05-01

### Fixed

- Add missing `useMediaLayout` export ([#1408](https://github.com/Shopify/quilt/pull/1408))

## [1.9.0] - 2020-04-23

### Added

- Added `useMediaLayout` hook ([#1396](https://github.com/Shopify/quilt/pull/1396))

## [1.8.0] - 2020-04-14

- Added a `useMedia` hook ([#1364](https://github.com/Shopify/quilt/pull/1364))

## [1.7.0] - 2020-04-08

### Added

- Added `useDebouncedValue` hook ([#1354](https://github.com/Shopify/quilt/pull/1354))

## [1.6.1] - 2020-04-07

### Fixed

- `useOnChangeValue` is now executed in an `useEffect` and doesn't block the render method anymore. **This fix may cause timing issue in your project if you depended on the change handler happening synchronously.**

## [1.6.0] - 2020-03-02

### Added

- Added support for `null` `delay` argument to `useTimeout`, to clear the timeout ([#1306](https://github.com/Shopify/quilt/pull/1306))

### Fixed

- Improved `useTimeout` hook, so it doesn't reset the timeout if the `callback` changes ([#1306](https://github.com/Shopify/quilt/pull/1306))

## [1.5.0] - 2020-03-12

- Added `useInterval` hook ([#1241](https://github.com/Shopify/quilt/pull/1241))

## [1.4.0] - 2019-12-19

- Added `useToggle` hook ([#1220](https://github.com/Shopify/quilt/pull/1220))

## [1.3.0] - 2019-10-29

- Added a `usePrevious` hook ([#1145](https://github.com/Shopify/quilt/pull/1145))

## [1.2.0] - 2019-04-25

- Added a `useMountedRef` hook ([#663](https://github.com/Shopify/quilt/pull/663))

## [1.1.0] - 2019-04-17

### Added

- Added a `useLazyRef` hook ([#659](https://github.com/Shopify/quilt/pull/659))

## [1.0.0] - 2019-04-12

### Added

- `@shopify/react-hooks` package with initial hooks for `useTimeout` and `useOnValueChange` ([#609](https://github.com/Shopify/quilt/pull/609))
