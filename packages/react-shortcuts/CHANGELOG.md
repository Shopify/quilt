# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.1.2] - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## [3.1.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [3.0.15] - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

### Fixed

- Added a check for event.getModifierState method before calling it. ([#1578](https://github.com/Shopify/quilt/pull/1578))

## [3.0.0] - 2019-04-02

### Changed

- **Breaking** - Require `react@16.8.1` or higher to support React hooks. ([#615](https://github.com/Shopify/quilt/pull/615))

### Added

- This CHANGELOG [(#508)](https://github.com/Shopify/quilt/pull/508)
