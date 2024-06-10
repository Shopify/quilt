# Changelog

## 3.3.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

## 3.2.2

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

## 3.2.1

### Patch Changes

- [#2739](https://github.com/Shopify/quilt/pull/2739) [`95b060fbd`](https://github.com/Shopify/quilt/commit/95b060fbdd32e260cc104cae821fd78a7a31aa00) Thanks [@chaitanyambilgikar](https://github.com/chaitanyambilgikar)! - Detect POS Go devices as mobile devices

## 3.2.0

### Minor Changes

- [#2721](https://github.com/Shopify/quilt/pull/2721) [`19a5b55ae`](https://github.com/Shopify/quilt/commit/19a5b55aef9bbfc5ba518e5076323805b7538fe0) Thanks [@chaitanyambilgikar](https://github.com/chaitanyambilgikar)! - New utility to check the user agent of the Shopify POS App

## 3.1.3

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

## 3.1.2

### Patch Changes

- [#2542](https://github.com/Shopify/quilt/pull/2542) [`99a9903f1`](https://github.com/Shopify/quilt/commit/99a9903f1c17b9a3a526913685427e545727b152) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump dependency on `ua-parser-js` to `^0.7.33`

## 3.1.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 3.1.0 - 2022-06-08

### Changed

- Added new method `isAndroid` to correctly identify Android devices [[#2299](https://github.com/Shopify/quilt/pull/2299)]

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.0.9 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.0.8 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.0.7 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.0.6 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.0.5 - 2021-11-01

### Changed

- Updated ua-parser-js dependency to `^0.7.30` [[#2061](https://github.com/Shopify/quilt/pull/2061)]

## 2.0.4 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.0.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.1.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.1.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.0.1 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.0.0 - 2020-05-20

### Added

- `@shopify/browser` package
