# Changelog

## 5.0.2

### Patch Changes

- Updated dependencies [[`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f)]:
  - @shopify/useful-types@5.1.0

## 5.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.0.11 - 2022-04-25

- No updates. Transitive dependency bump.

## 4.0.10 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.0.9 - 2022-03-07

- No updates. Transitive dependency bump.

## 4.0.8 - 2022-02-28

- No updates. Transitive dependency bump.

## 4.0.7 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.0.6 - 2022-02-14

- No updates. Transitive dependency bump.

## 4.0.5 - 2022-02-09

- No updates. Transitive dependency bump.

## 4.0.4 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.0.3 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.0.2 - 2022-01-19

- No updates. Transitive dependency bump.

## 4.0.1 - 2021-12-07

- No updates. Transitive dependency bump.

## 4.0.0 - 2021-12-01

- No updates. Transitive dependency bump.

## 3.0.3 - 2021-11-25

- No updates. Transitive dependency bump.

## 3.0.2 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.1 - 2021-11-22

- No updates. Transitive dependency bump.

## 3.0.0 - 2021-11-08

- No updates. Transitive dependency bump.

## 2.1.7 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.6 - 2021-09-14

- No updates. Transitive dependency bump.

## 2.1.5 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2014)]

## 2.1.4 - 2021-08-26

- No updates. Transitive dependency bump.

## 2.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 2.0.2 - 2021-06-08

### Changed

- Transitive dependency update of web-worker

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.3.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.24 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.0 - 2019-11-11

### Added

- Re-exports the new `createPlainWorkerFactory` function from `@shopify/web-worker` ([#1174](https://github.com/Shopify/quilt/pull/1174)).

## 1.1.0 - 2019-11-08

- You can now pass options as the second argument to `useWorker`. These options are forwarded as the [options to the worker creator](../web-worker#customizing-worker-creation) ([#1172](https://github.com/Shopify/quilt/pull/1172)).

## 1.0.4 - 2019-11-07

### Fixed

- `terminate` now properly terminates the worker ([#1166](https://github.com/Shopify/quilt/pull/1166/))).

## 1.0.0 - 2019-10-18

### Changed

- `createWorker` has been renamed to `createWorkerFactory` ([#1129](https://github.com/Shopify/quilt/pull/1129)).

## 0.0.1 - 2019-10-16

### Added

- `@shopify/react-web-worker` package
