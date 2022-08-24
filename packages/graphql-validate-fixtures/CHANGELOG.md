# Changelog

## 3.1.2

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - graphql-config-utilities@4.1.2
  - graphql-tool-utilities@3.0.1

## 3.1.1

### Patch Changes

- Updated dependencies [[`0d82c68f4`](https://github.com/Shopify/quilt/commit/0d82c68f450f101c516f340656f85e3930919067)]:
  - graphql-config-utilities@4.1.1

## 3.1.0

### Minor Changes

- [#2282](https://github.com/Shopify/quilt/pull/2282) [`6fee77510`](https://github.com/Shopify/quilt/commit/6fee775105044d061973e8731b39c439c7ce950f) Thanks [@vsumner](https://github.com/vsumner)! - Update graphql-config to 4

### Patch Changes

- Updated dependencies [[`6fee77510`](https://github.com/Shopify/quilt/commit/6fee775105044d061973e8731b39c439c7ce950f)]:
  - graphql-config-utilities@4.1.0

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.8 - 2022-04-25

- No updates. Transitive dependency bump.

## 2.1.7 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.6 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.5 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.4 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.3 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 2.1.2 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.1 - 2021-08-30

- No updates. Transitive dependency bump.

## 2.1.0 - 2021-08-26

### Changed

- Remove reference to deprecated `resolveProjectName` [[#2010](https://github.com/Shopify/quilt/pull/2010)]

## 2.0.6 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

### Added

- Support for `graphql`@`15.x` [[#1978](https://github.com/Shopify/quilt/pull/1978/files)]

## 2.0.5 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.4 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.3 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 2.0.1 - 2021-06-01

### Fixed

- Fix binary files referencing non-existent files [#1929](https://github.com/Shopify/quilt/pull/1929)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.0.2 - 2021-05-19

### Fixed

- Fix broken file exports. [#1894](https://github.com/Shopify/quilt/pull/1894)

## 1.0.1 - 2021-05-07

### Breaking Change

- Update `graphql-config` to version 3. Update `graphql-config-utilities`. [#1883](https://github.com/Shopify/quilt/pull/1883)

## 0.14.3 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.14.2 - 2021-03-23

### Fixed

- Fix `graphql-validate-fixtures` binary not running [[#1798](https://github.com/Shopify/quilt/pull/1798)]

## 0.14.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt
