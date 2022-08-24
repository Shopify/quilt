# Changelog

## 4.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.1.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.1.4 - 2022-03-07

### Changed

- Export cjs by default for `babel`. [[#2193](https://github.com/Shopify/quilt/pull/2193)]

## 3.1.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.1.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.1.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.1.0 - 2021-12-01

### Changed

- Removed `@types/webpack` dependency [[#2013](https://github.com/Shopify/quilt/pull/2013)]

## 3.0.7 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.6 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.2.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.2.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.1.7 - 2020-12-11

### Added

- Added `createAsyncQuery` from AlpaQL to the list of default transforms. ([#1702](https://github.com/Shopify/quilt/pull/1702))

## 2.1.6 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.1.0 - 2019-10-30

### Added

- Added `createAsyncQuery` to the list of default transforms ([#1153](https://github.com/Shopify/quilt/pull/1153))

### Fixed

- Patch: Documentation typo fix in README.md ([842](https://github.com/Shopify/quilt/pull/842))

## 2.0.0 - 2019-07-03

### Added

- Moved several module resolving features to this library from `react-async` ([#762](https://github.com/Shopify/quilt/pull/762))

## 1.3.0 - 2019-03-25

### Added

- `DeferTiming` now includes an `InViewport` strategy ([#576](https://github.com/Shopify/quilt/pull/576))

## 1.2.0 - 2019-03-11

### Added

- Added a `DeferTiming` enum for shared defer strategies ([#561](https://github.com/Shopify/quilt/pull/561))

## 1.1.0 - 2019-02-25

### Added

- Added a `webpack` option to disable the Webpack-specific transform ([#530](https://github.com/Shopify/quilt/pull/530))
