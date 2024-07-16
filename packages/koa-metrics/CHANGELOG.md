# Changelog

## 2.2.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

## 2.1.1

### Patch Changes

- [#2795](https://github.com/Shopify/quilt/pull/2795) [`8fa47ffa2`](https://github.com/Shopify/quilt/commit/8fa47ffa22bfdd98c9dc8f94e0ab913d7fef1ba0) Thanks [@iAmNathanJ](https://github.com/iAmNathanJ)! - fix: babel transformations for node targets

## 2.1.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

### Patch Changes

- Updated dependencies [[`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece)]:
  - @shopify/statsd@4.5.0

## 2.0.9

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

- Updated dependencies [[`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47)]:
  - @shopify/statsd@4.4.1

## 2.0.8

### Patch Changes

- Updated dependencies [[`224609455`](https://github.com/Shopify/quilt/commit/2246094558e46d40285327a13d79a106b32e3b72)]:
  - @shopify/statsd@4.4.0

## 2.0.7

### Patch Changes

- Updated dependencies [[`e3db8be05`](https://github.com/Shopify/quilt/commit/e3db8be0599474ab132aaa86cf2f492929e8a6a8)]:
  - @shopify/statsd@4.3.0

## 2.0.6

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

- Updated dependencies [[`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86)]:
  - @shopify/statsd@4.2.2

## 2.0.5

### Patch Changes

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

- Updated dependencies [[`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f)]:
  - @shopify/statsd@4.2.1

## 2.0.4

### Patch Changes

- Updated dependencies [[`3b228b4f3`](https://github.com/Shopify/quilt/commit/3b228b4f34a57894ad552188f55dfce372324b85)]:
  - @shopify/statsd@4.2.0

## 2.0.3

### Patch Changes

- Updated dependencies [[`da04b9e63`](https://github.com/Shopify/quilt/commit/da04b9e63819a51abfca04008e01f6935d886297)]:
  - @shopify/statsd@4.1.1

## 2.0.2

### Patch Changes

- Updated dependencies [[`9396ac6eb`](https://github.com/Shopify/quilt/commit/9396ac6eb66220ad1dd40c57f66c193cd14e4780), [`472e3556a`](https://github.com/Shopify/quilt/commit/472e3556a07cb3315261e043d19a44a01ca17432), [`da62f58f4`](https://github.com/Shopify/quilt/commit/da62f58f46bb3a27f55ef4cc59c5292b9a842a24)]:
  - @shopify/statsd@4.1.0

## 2.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/statsd@4.0.1

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 1.1.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.1.4 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 1.1.3 - 2022-02-02

- No updates. Transitive dependency bump.

## 1.1.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.1.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.1.0 - 2022-01-13

- No updates. Transitive dependency bump.

## 1.0.9 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.0.8 - 2021-11-22

- No updates. Transitive dependency bump.

## 1.0.7 - 2021-11-01

- No updates. Transitive dependency bump.

## 1.0.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.0.5 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 1.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.5.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.5.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.4.4 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.4.0 - 2020-04-03

- Adding support for `X-Request-Start` header if it is prefix with `t=` ([#1352](https://github.com/Shopify/quilt/pull/1352))

## 0.3.6 - 2019-11-20

- Fix broken default export from 0.3.0 ([#1187](https://github.com/Shopify/quilt/pull/1187))

## 0.3.0 - 2019-10-07

- Use `@shopify/statd` instead of Metrics implementation. The log using logger in distribution was removed. ([#1074](https://github.com/Shopify/quilt/pull/1074))

## 0.2.0 - 2019-04-12

- Wrapping all the calls in a Promise and awaiting them at the end of the middleware.
- Remove .measure because it wasn't used anymore.
- Update hot-shots to support optional arguments for .distribution.
  ([#640](https://github.com/Shopify/quilt/pull/640))

## 0.1.12 - 2019-01-09

- Start of Changelog
