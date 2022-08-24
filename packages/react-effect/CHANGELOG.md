# Changelog

## 5.0.2

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 5.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.1.12 - 2022-03-15

- No updates. Transitive dependency bump.

## 4.1.11 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.1.10 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.1.9 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.1.8 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.1.7 - 2021-11-23

- No updates. Transitive dependency bump.

## 4.1.6 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 4.1.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 4.1.4 - 2021-08-30

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2014)]

## 4.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 4.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 4.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 4.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 4.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 3.3.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 3.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 3.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 3.2.13 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 3.2.1 - 2019-01-27

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## 3.2.0 - 2019-06-27

### Fixed

- Fixed an issue where `betweenEachPass` was called on the last pass before `maxPasses` was reached. In order to correct this issue, returning `false` from `betweenEachPass` no longer halts render looping (use `afterEachPass` instead). [#769](https://github.com/Shopify/quilt/pull/769)

## 3.1.0 - 2019-06-14

### Added

- You can now bail out of render passes in `extract` by returning `false` (or a promise that resolves to `false`) from `betweenEachPass`/ `afterEachPass` ([#747](https://github.com/Shopify/quilt/pull/747))

## 3.0.0 - 2019-04-08

This library now requires React 16.8.

### Added

- Added a `useServerEffect` hook as an alternative to the `<Effect />` component ([#547](https://github.com/Shopify/quilt/pull/547))

## 2.1.0

### Added

- Added a `maxPasses` option to `extract()` in order to limit the potential for infinite loops. This option defaults to 5 max render/ resolve cycles [#574](https://github.com/Shopify/quilt/pull/574)
- All `afterEachPass`/ `betweenEachPass` callbacks now receive an argument detailing the current pass index, whether the extraction process is complete, and the duration of the render/ resolve phases [#574](https://github.com/Shopify/quilt/pull/574)

## 2.0.0

### Changed

- Removed `react-tree-walker` as a way to process the React element. Instead, the application is rendered to a string repeatedly until no more promises have been queued. For full details on migrating to the new API, please read the [upgrade guide](./documentation/migrating-version-1-to-2.md). [#477](https://github.com/Shopify/quilt/pull/477)

## 1.0.3

- Manual release

## 1.0.1

### Fixed

- Published the server entry point. [#410](https://github.com/Shopify/quilt/pull/410)

## 1.0.0

Initial release
