# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.1]

### Fixed

- now correctly depends on `fast-deep-equal` [#680](https://github.com/Shopify/quilt/pull/680)
- no longer triggers set-state warnings when the component calling `useSubmit` is unmounted during submission [#680](https://github.com/Shopify/quilt/pull/680)

## [0.1.0]

### Changed

- `useList` now reinitializes based on `deepEquals` rather than reference equality [#675](https://github.com/Shopify/quilt/pull/675)
- `useField` can better tell the difference between field config objects and regular old object literals [#675](https://github.com/Shopify/quilt/pull/675)
- `useField` now reinitializes based on `deepEquals` rather than reference equality [#675](https://github.com/Shopify/quilt/pull/675)

## [0.0.1]

### Added

- `@shopify/react-form` package
