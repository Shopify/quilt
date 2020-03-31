# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [1.1.1] - 2019-07-04

### Fixed

- Made it so that serializations are automatically cleared between `react-effect` passes to prevent client/ server mismatches

## [1.1.0] - 2019-07-03

### Added

- Added the `HydrationTracker` component and `useHydrationManager` to support behavior that depends on whether hydration has already occurred ([#762](https://github.com/Shopify/quilt/pull/762))

### Added

- `@shopify/react-hydrate` package
