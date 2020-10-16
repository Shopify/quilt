# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Added `tslib@^1.14.1` in the list of dependencies

## [2.0.0] - 2019-12-24

### Changed

- Update `hot-spot` dependencies [[#1650](https://github.com/Shopify/quilt/pull/1650)]

### Added

- added `timing` metric support from `hot-spot`

## [1.2.0] - 2019-12-24

### Added

- added `gauge` metric support from `hot-spot`

## [1.1.0] - 2019-10-08

### Added

- now handles converting non-string values to strings for tag dictionaries and converts empty tag values to `Unknown` [#1095](https://github.com/Shopify/quilt/pull/1095)

## [1.0.0] - 2019-10-07

### Added

- `@shopify/statsd` package
