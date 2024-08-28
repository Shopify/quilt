# Changelog

## 3.1.1

### Patch Changes

- [#2830](https://github.com/Shopify/quilt/pull/2830) [`88f1cbe`](https://github.com/Shopify/quilt/commit/88f1cbed60807594537c52da1d2af1ae74c60795) Thanks [@BPScott](https://github.com/BPScott)! - Fix import of apollo-codegen-core when using the mjs version of the package

## 3.1.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

## 3.0.4

### Patch Changes

- [#2778](https://github.com/Shopify/quilt/pull/2778) [`12f780698`](https://github.com/Shopify/quilt/commit/12f7806982f7b0b890792e9d389cbf6055a68362) Thanks [@BPScott](https://github.com/BPScott)! - Add graphql `^16.0.0` as an allowable graphql dependency version

## 3.0.3

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

## 3.0.2

### Patch Changes

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 3.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.7 - 2022-04-25

### Changed

- Relax constraints on `apollo-codegen-core` [#2238](https://github.com/Shopify/quilt/pull/2238)

## 2.1.6 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.5 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.4 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.3 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.2 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.1 - 2021-08-30

### Changed

- Update `apollo-codegen-core` to support `graphql`@`15.x`. [[#2019](https://github.com/Shopify/quilt/pull/2019)]

## 2.1.0 - 2021-08-26

### Changed

- Support for `graphql`@`15.x`. [[#1978](https://github.com/Shopify/quilt/pull/1978)]

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
- Removed core-js dependency, as its polyfills are no longer needed in node 12. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.4.2 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.4.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt

## 1.3.0 - 2020-12-03

- Updated dependency: `core-js@^3.0.0`.

## 1.2.0 - 2019-04-22

- Start of Changelog
