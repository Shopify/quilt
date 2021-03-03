# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## [1.2.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [1.1.13] - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [1.1.0] - 2019-03-22

### Changed

- move to use the enhancer version of `memoize` ([#594](https://github.com/Shopify/quilt/pull/594))

## [1.0.1] - 2019-03-11

### Fixed

- fix the bug where `memoize` will only remember result once per property definition. It will now memoize per instance. ([#567](https://github.com/Shopify/quilt/pull/567))

## [1.0.0] - 2019-03-07

### Added

- `@shopify/decorators` package with `memoize` decorator
