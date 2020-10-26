# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [1.1.3] - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [1.1.0] - 2020-09-15

### Fixed

- Exported `useImportRemote` hook and `Status`([1634](https://github.com/Shopify/quilt/pull/1634))

## [1.0.0] - 2019-05-03

### Changed

- Changes to the props of `<ImportRemote />` mid-render will cause the import to be canceled. ([608](https://github.com/Shopify/quilt/pull/608))
- Removed `onError` callback prop. `onImported` now receives an error in the case that an error occurs during the import. ([608](https://github.com/Shopify/quilt/pull/608))
- Added `useImportRemote()` hook ([608](https://github.com/Shopify/quilt/pull/608))

### Added

- This CHANGELOG [(#575)](https://github.com/Shopify/quilt/pull/575)
