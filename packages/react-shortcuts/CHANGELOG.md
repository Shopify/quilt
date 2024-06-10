# Changelog

## 5.2.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

- [#2787](https://github.com/Shopify/quilt/pull/2787) [`f50049004`](https://github.com/Shopify/quilt/commit/f500490042d922b66a6781c3450f876a83a120cb) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for React 17

## 5.1.0

### Minor Changes

- [#2674](https://github.com/Shopify/quilt/pull/2674) [`11c3b1dfe`](https://github.com/Shopify/quilt/commit/11c3b1dfe5dfbc2ced7b76cba42d5b1a218ce090) Thanks [@alexandcote](https://github.com/alexandcote)! - Allow consumer to trigger shortcut

## 5.0.4

### Patch Changes

- [#2611](https://github.com/Shopify/quilt/pull/2611) [`5d569d1cf`](https://github.com/Shopify/quilt/commit/5d569d1cf333ccc14fe5cf667abed203c07f527a) Thanks [@BPScott](https://github.com/BPScott)! - Adjust imports of internal types to adhere to TypeScript's verbatimModuleSyntax format. This does not affect externally presented types.

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

## 5.0.3

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 5.0.2

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 5.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.2.4 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.2.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.2.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.2.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.2.0 - 2022-01-24

### Added

- **Minor** Expose `acceptedDefaultIgnoredTags` to flag which default ignored tags you want to bypass (textarea, select, input) [#2125](https://github.com/Shopify/quilt/pull/2125)

### Fixed

- Fix issue with shortcuts not triggered when `node` is provided and focused [#2125](https://github.com/Shopify/quilt/pull/2125)

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

## 3.1.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 3.1.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 3.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 3.0.15 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

### Fixed

- Added a check for event.getModifierState method before calling it. ([#1578](https://github.com/Shopify/quilt/pull/1578))

## 3.0.0 - 2019-04-02

### Changed

- **Breaking** - Require `react@16.8.1` or higher to support React hooks. ([#615](https://github.com/Shopify/quilt/pull/615))

### Added

- This CHANGELOG [(#508)](https://github.com/Shopify/quilt/pull/508)
