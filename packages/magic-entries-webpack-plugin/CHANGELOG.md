# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## [0.2.1] - 2021-02-16

### Changed

- Fixed invalid version constraint on `webpack` peer dependency. [#1743](https://github.com/Shopify/quilt/pull/1743)

## [0.2.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [0.1.4] - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [0.1.0] - 2020-05-05

### Added

- `@shopify/magic-entries-webpack-plugin` package [[#1412](https://github.com/Shopify/quilt/pull/1412)]
