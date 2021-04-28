# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 2.4.0 - 2021-04-23

### Added

- Add `DeepOmit` and `DeepOmitArray` type to recursively omit field from nested type definition [#1807](https://github.com/Shopify/quilt/pull/1807)

## 2.3.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.2.1 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.2.0 - 2019-06-12

### Added

- Added the `ConstructorArguments`, `ConstructorArgumentAtIndex`, and `FirstConstructorArgument` type aliases

## 2.1.4 - 2019-01-27

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## 2.1.0 - 2019-10-30

### Added

- Added the `NoInfer<T>` type alias.

## 2.0.0

- Removed `Props<T>`, see `ComponentProps`, `ComponentPropsWithRef`, and `ComponentPropsWithoutRef` from `react` for a replacement strategy ([#846](https://github.com/Shopify/quilt/pull/846))

## 1.3.0

### Added

- Added the `ArgumentAtIndex` type ([#691](https://github.com/Shopify/quilt/pull/691))

## 1.1.0

### Added

- Added new `DeepPartial` type. ([#456](https://github.com/Shopify/quilt/pull/456))
- Added new `ArrayElement` type. ([#470](https://github.com/Shopify/quilt/pull/470))

## 1.0.0

Initial release
