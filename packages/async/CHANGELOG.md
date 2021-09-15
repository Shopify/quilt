# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.2.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.2.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.1.7 - 2020-12-11

### Added

- Added `createAsyncQuery` from AlpaQL to the list of default transforms. ([#1702](https://github.com/Shopify/quilt/pull/1702))

## 2.1.6 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.1.0 - 2019-10-30

### Added

- Added `createAsyncQuery` to the list of default transforms ([#1153](https://github.com/Shopify/quilt/pull/1153))

### Fixed

- Patch: Documentation typo fix in README.md ([842](https://github.com/Shopify/quilt/pull/842))

## 2.0.0 - 2019-07-03

### Added

- Moved several module resolving features to this library from `react-async` ([#762](https://github.com/Shopify/quilt/pull/762))

## 1.3.0 - 2019-03-25

### Added

- `DeferTiming` now includes an `InViewport` strategy ([#576](https://github.com/Shopify/quilt/pull/576))

## 1.2.0 - 2019-03-11

### Added

- Added a `DeferTiming` enum for shared defer strategies ([#561](https://github.com/Shopify/quilt/pull/561))

## 1.1.0 - 2019-02-25

### Added

- Added a `webpack` option to disable the Webpack-specific transform ([#530](https://github.com/Shopify/quilt/pull/530))
