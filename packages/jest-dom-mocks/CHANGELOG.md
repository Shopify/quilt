# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Added `length` prop to storage mock [[#2107](https://github.com/Shopify/quilt/pull/2107)]

## 3.0.10 - 2021-12-01

- No updates. Transitive dependency bump.

## 3.0.9 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.8 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.7 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.6 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.5 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 3.0.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.2 - 2021-06-29

### Fixed

- Dimension mocks no longer leak invalid values into other tests after being restored. [[#1961](https://github.com/Shopify/quilt/pull/1961)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.11.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.11.4 - 2021-04-07

### Changed

- Updated match-media mock so it passes TypeScript's "strictPropertyInitialization" checks. [#1814](https://github.com/Shopify/quilt/pull/1814)

## 2.11.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.10.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698

## 2.9.4 - 2020-12-08

### Added

- Updated `fetch-mock` dependency to `^9.11.0`. [#1691](https://github.com/Shopify/quilt/pull/1691)

### Fixed

- Fixed broken `location` module and re-enabled tests [#1684](https://github.com/Shopify/quilt/pull/1684)

## 2.9.3 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.9.2 - 2020-10-09

### Added

- `fetch-mock` is updated to the latest version [#1510](https://github.com/Shopify/quilt/pull/1510)

  Please see the [migration guide](./migration-guide.md) for more information.

## 2.9.1 - 2020-05-05

### Added

- Fixed setup instructions instructions for `ensureMocksReset`

## 2.9.0 - 2020-04-23

- Added mock for `innerWidth` to dimensions ([#1399](https://github.com/Shopify/quilt/pull/1399))

## 2.8.0 - 2019-10-03

- Added the `Connection` class for to allow mocking `navigator.connection` in tests [#1083](https://github.com/Shopify/quilt/pull/1083/files)

## 2.7.1 - 2019-07-03

### Fixed

- Fixed bad default behaviour when specifying only a subset of an `IntersectionObserver` mock ([#762](https://github.com/Shopify/quilt/pull/762))

## 2.7.0 - 2019-06-24

### Added

- Accurate return types for `Storage` mocks

## 2.6.1 - 2019-04-25

### Fixed

- Now correctly declares a dependency on `@shopify/react-async`

### Added

- Added a mock for dimensions ([#625](https://github.com/Shopify/quilt/pull/625))

## 2.5.0 - 2019-03-28

### Added

- Added a mock for `Promise` ([#614](https://github.com/Shopify/quilt/pull/614))

## 2.4.0

### Added

- Added a mock for `IntersectionObserver` and `requestIdleCallback` ([#576](https://github.com/Shopify/quilt/pull/576))

## 2.2.0

### Added

- User timing mocks [#468](https://github.com/Shopify/quilt/pull/468).

## 2.1.3 - 2019-01-09

- Start of Changelog
