# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 1.2.1 - 2021-06-22

### Changed

- Include `setImmediate` in tests. [#1948](https://github.com/Shopify/quilt/pull/1948)

## 1.2.0 - 2021-06-08

### Changed

- Add `appendToEntries` to to allow outside sources to add to the final entries object before compilation [#1932](https://github.com/Shopify/quilt/pull/1932)

## 1.1.0 - 2021-06-08

### Changed

- Update `webpack-virtual-modules` to 0.4.3 which support webpack 5

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.2.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.2.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.2.1 - 2021-02-16

### Changed

- Fixed invalid version constraint on `webpack` peer dependency. [#1743](https://github.com/Shopify/quilt/pull/1743)

## 0.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.1.4 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.1.0 - 2020-05-05

### Added

- `@shopify/magic-entries-webpack-plugin` package [[#1412](https://github.com/Shopify/quilt/pull/1412)]
