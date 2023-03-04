# Changelog

## 2.2.1

### Patch Changes

- [#2583](https://github.com/Shopify/quilt/pull/2583) [`2aa32e8b8`](https://github.com/Shopify/quilt/commit/2aa32e8b844bda24e9ed1b2747ad9b34491c6261) Thanks [@BPScott](https://github.com/BPScott)! - Add explict `return undefined` to functions that had implicit returns

- [#2583](https://github.com/Shopify/quilt/pull/2583) [`2aa32e8b8`](https://github.com/Shopify/quilt/commit/2aa32e8b844bda24e9ed1b2747ad9b34491c6261) Thanks [@BPScott](https://github.com/BPScott)! - getExtensionFromMimeType should return undefined if you pass in an unknown mime type

## 2.2.0

### Minor Changes

- [#2521](https://github.com/Shopify/quilt/pull/2521) [`19002630b`](https://github.com/Shopify/quilt/commit/19002630b8af10d18a4367f2afe070c584d59537) Thanks [@FredyPla](https://github.com/FredyPla)! - Add SVG mimetype

## 2.1.0

### Minor Changes

- [#2384](https://github.com/Shopify/quilt/pull/2384) [`705dc371f`](https://github.com/Shopify/quilt/commit/705dc371fc691e1fed5f7c998962b42fb19b2095) Thanks [@FredyPla](https://github.com/FredyPla)! - Add Webm mimetype

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 1.2.4 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.2.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 1.2.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.2.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.2.0 - 2022-01-07

### Changed

- Add WebP and HEIC mimetype [2118](https://github.com/Shopify/quilt/pull/2118/)

## 1.1.1 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.1.0 - 2021-09-03

### Added

- Add USDZ mimetype [#2026](https://github.com/Shopify/quilt/pull/2026/)

## 1.0.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.0.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.0.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.2.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.2.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.1.2 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.1.0 - 2020-05-23

- Added extra common mime types [#1372](https://github.com/Shopify/quilt/pull/1372)

## 0.0.1 - 2020-04-23

### Added

- `@shopify/mime-types` package
