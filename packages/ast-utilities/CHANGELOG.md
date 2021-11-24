# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- New transform `wrapJsxChildren()` that wraps a JSX node’s children with a given JSX Element

### Fixed

- `replaceJsxBody()` support for when parent node is root [[#2085])](https://github.com/Shopify/quilt/pull/2085)]
- `addImportSpecifier()` doesn't allow duplicate specifiers [[#2081)](https://github.com/Shopify/quilt/pull/2081)]

## 1.1.2 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.1.1 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.1.0 - 2021-11-15

### Added

- Options object with `noDuplicates` boolean to third argument in `addComponentProps()` (true by default) [[#2075](https://github.com/Shopify/quilt/pull/2075)]

### Fixed

- Fix: missing dependency errors on babel-plugins [[#2072](https://github.com/Shopify/quilt/pull/2072)]

## 1.0.7 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.0.6 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.0.5 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.0.4 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.0.3 - 2021-06-29

- No updates. Transitive dependency bump.

## 1.0.2 - 2021-06-22

### Changed

- Update `@babel/template` to `^7.14.5` [#1948](https://github.com/Shopify/quilt/pull/1948)

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.2.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)
- Added an empty file to use as the index entrypoint, instead of causing a file-not-found error. [#1834](https://github.com/Shopify/quilt/pull/1834)

## 0.2.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.1.1 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.1.0 - 2020-04-20

### Changed

- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]
- Update `jest-matcher-utils` to `25` [[#1375](https://github.com/Shopify/quilt/pull/1375)]

## 0.0.3 - 2019-09-18

- Added support for various `unreleased` heading formatting in `addReleaseToChangelog`

## 0.0.2 - 2019-09-18

- Added markdown utils starting with `addReleaseToChangelog`

### Added

- `@shopify/ast-utilities` package
