# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 3.1.0 - 2022-01-13

### Changed

- Update required version of `koa` to `^2.13.4` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 3.0.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.7 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.6 - 2021-11-01

- No updates. Transitive dependency bump.

## 3.0.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.3.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.2.4 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.2.0 - 2019-12-19

### Added

- `Options` type is now exported for `createMockContext` [#1209](https://github.com/Shopify/quilt/pull/1209)

## 2.1.7 - 2019-10-23

### Fixed

- `createMockCookies` is now correctly exported [#595](https://github.com/Shopify/quilt/pull/595)

## 2.1.0 - 2019-01-18

### Fixed

- `createMockContext` output is now typed as `Koa.Context` so consumers don't need to cast [#453](https://github.com/Shopify/quilt/pull/453)

### Added

- `createMockContext` supports `rawBody` as a field [#453](https://github.com/Shopify/quilt/pull/453)

## 2.0.15 - 2019-01-11

- Fix setting custom state in mock context [#467](https://github.com/Shopify/quilt/pull/467)

## 2.0.14 - 2019-01-09

- Start of Changelog
