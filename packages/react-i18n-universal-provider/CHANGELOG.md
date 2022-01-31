# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.23 - 2022-01-28

- No updates. Transitive dependency bump.

## 2.1.22 - 2022-01-28

- No updates. Transitive dependency bump.

## 2.1.21 - 2022-01-19

- No updates. Transitive dependency bump.

## 2.1.20 - 2022-01-18

- No updates. Transitive dependency bump.

## 2.1.19 - 2022-01-06

- No updates. Transitive dependency bump.

## 2.1.18 - 2021-12-07

- No updates. Transitive dependency bump.

## 2.1.17 - 2021-12-01

- No updates. Transitive dependency bump.

## 2.1.16 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.1.15 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 2.1.14 - 2021-11-15

- No updates. Transitive dependency bump.

## 2.1.13 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.12 - 2021-09-14

- No updates. Transitive dependency bump.

## 2.1.11 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2016)]

## 2.1.10 - 2021-09-03

- No updates. Transitive dependency bump.

## 2.1.9 - 2021-08-30

- No updates. Transitive dependency bump.

## 2.1.8 - 2021-08-26

- No updates. Transitive dependency bump.

## 2.1.7 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.1.6 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 2.1.5 - 2021-08-10

- No updates. Transitive dependency bump.

## 2.1.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.1.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.1.2 - 2021-07-28

- No updates. Transitive dependency bump.

## 2.1.1 - 2021-07-26

- No updates. Transitive dependency bump.

## 2.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 2.0.4 - 2021-06-29

- No updates. Transitive dependency bump.

## 2.0.3 - 2021-06-22

- No updates. Transitive dependency bump.

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.1.10 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.1.5 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.0.67 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.0.59 - 2020-06-04

### Fixed

- Fixed merge of serialized i18n data and override values

## 1.0.28 - 2019-11-29

- Updated dependency: `@shopify/react-i18n@2.3.0`

## 1.0.12 - 2019-09-25

### Changed

- Updated dependency: `@shopify/react-i18n@2.0.1`

## 1.0.11 - 2019-09-19

### Changed

- Updated dependency: `@shopify/react-i18n@2.0.0`

## 1.0.10 - 2019-09-18

### Changed

- Updated dependency: `@shopify/react-i18n@1.10.0`

## 1.0.9 - 2019-09-17

### Changed

- Updated to `@shopify/react-i18n@1.9.2`

## 1.0.0 - 2019-08-29

### Added

- `@shopify/react-i18n-universal-provider` package
