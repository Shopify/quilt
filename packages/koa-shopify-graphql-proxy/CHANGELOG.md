# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 6.0.3 - 2022-01-13

### Changed

- Update `koa-better-http-proxy` to `0.2.9` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 6.0.2 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 6.0.1 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 6.0.0 - 2021-08-18

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

### Breaking Change

- Replace ApiVersion enum with a looser string union type and update supported versions [[#2001](https://github.com/Shopify/quilt/pull/2001)]

## 5.0.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 5.0.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 5.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 4.1.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 4.1.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 4.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 4.0.4 - 2020-10-23

- The `ApiVersion` enum now has an `October20` option. [#1654](https://github.com/Shopify/quilt/pull/1654)

## 4.0.3 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 4.0.2 - 2020-09-28

### Fixed

- Delete cookie header before proxying GraphQL request ([#820](https://github.com/Shopify/quilt/pull/820))

## 4.0.0 - 2020-05-01

= The `ApiVersion` enum now has a `April20` and `July20` options

## 3.3.0 - 2020-02-19

= The `ApiVersion` enum now has a `January20` and `April20` options

## 3.2.0 - 2010-10-02

= The `ApiVersion` enum now has an `October19` option

## 3.1.0 - 2019-04-23

### Added

- The `ApiVersion` enum now has an `unversioned` option ([#665](https://github.com/Shopify/quilt/pull/665))

## 3.0.0 - 2019-04-10

### Added

- The factory to create a middleware now accepts a `version` option, which can be any member of the newly-exported `ApiVersion` enum ([#629](https://github.com/Shopify/quilt/pull/629))

## 2.1.5 - 2019-01-09

- Start of Changelog
