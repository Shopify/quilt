# Changelog

## 3.2.0

### Minor Changes

- [#2338](https://github.com/Shopify/quilt/pull/2338) [`30005950b`](https://github.com/Shopify/quilt/commit/30005950baa33cf0ae7eda6d4fe1cc81fdb2ef70) Thanks [@atesgoral](https://github.com/atesgoral)! - Deprecate enum with typo, introduce correct version

## 3.1.0

### Minor Changes

- [#2323](https://github.com/Shopify/quilt/pull/2323) [`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d) Thanks [@atesgoral](https://github.com/atesgoral)! - Add additional headers and standardize X-prefixed ones

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.0.8 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.0.7 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.0.6 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.0.5 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.0.4 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.0.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.6.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.6.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.6.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.5.1 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.5.0 - 2019-08-18

Added `ResponseType` function ([#1579](https://github.com/Shopify/quilt/pull/1573))

## 1.4.0 - 2019-06-27

- Added the following headers: 'X-XSS-Protection', 'X-Frame-Options', 'X-Download-Options', 'X-Content-Type-Options', 'Strict-Transport-Security', 'Referrer-Policy' ([#752](https://github.com/Shopify/quilt/pull/752))

## 1.3.0 - 2019-06-12

- Added 'Accept-Language' header ([#752](https://github.com/Shopify/quilt/pull/752))

## 1.2.2

- Manual release

## 1.0.1

### Added

- Added additional headers

## 1.0.0

Initial release
