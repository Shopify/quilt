# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [2.1.12] - 2020-05-29

### Fixed

- Remove cast for `act` following update to `@types/react-dom`

## [2.1.11] - 2020-05-13

- `trigger` update the wrapper even if the promise is not resolved. [[#1439](https://github.com/Shopify/quilt/pull/1439)]

## [2.1.10] - 2020-05-13

- `trigger` now return the return value when the callback is a promise. [[#1434](https://github.com/Shopify/quilt/pull/1434)]

## [2.0.0] - 2019-03-28

### Changed

- `trigger` now runs the callback in a `react-dom` `act()` block, which prevents React warnings for synchronous updates resulting from calling a prop. This change means that the library now only supports React versions >=16.8 [[#612](https://github.com/Shopify/quilt/pull/612)]
