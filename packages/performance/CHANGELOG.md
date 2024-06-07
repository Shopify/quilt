# Changelog

## 4.3.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

## 4.2.0

### Minor Changes

- [#2705](https://github.com/Shopify/quilt/pull/2705) [`1d96be587`](https://github.com/Shopify/quilt/commit/1d96be587caff31e30895056294542b9742fbe7c) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Support for custom navigation timing

## 4.1.0

### Minor Changes

- [#2698](https://github.com/Shopify/quilt/pull/2698) [`790e16ad8`](https://github.com/Shopify/quilt/commit/790e16ad849af7b5c2c41c0c0df3f1492b90d04b) Thanks [@lemonmade](https://github.com/lemonmade)! - Add special performance event handling for time to last byte

## 4.0.0

### Major Changes

- [#2618](https://github.com/Shopify/quilt/pull/2618) [`0a1b2e16e`](https://github.com/Shopify/quilt/commit/0a1b2e16ed7e1f267d9c28a94f637724c1e67140) Thanks [@CameronGorrie](https://github.com/CameronGorrie)! - cacheEffectiveness uses cache ratio based on cache hit information discerned from transferSize and decodedBodySize properties

## 3.2.5

### Patch Changes

- [#2616](https://github.com/Shopify/quilt/pull/2616) [`f1eafee08`](https://github.com/Shopify/quilt/commit/f1eafee08d4fd00b50431c3d3c9bfa5b3397ac26) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Workaround quirk in React Router v6 that causes navigation to end prematurely

## 3.2.4

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

## 3.2.3

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 3.2.2

### Patch Changes

- [#2518](https://github.com/Shopify/quilt/pull/2518) [`fbf76bcc5`](https://github.com/Shopify/quilt/commit/fbf76bcc550f5178cf939d44d6559c4e882a7ccd) Thanks [@CameronGorrie](https://github.com/CameronGorrie)! - Performance now emits CSS resource download timing data when initiated by a link tag

## 3.2.1

### Patch Changes

- [#2488](https://github.com/Shopify/quilt/pull/2488) [`dcb3c54c0`](https://github.com/Shopify/quilt/commit/dcb3c54c064331ce45cc99958dd68d0d0a769f72) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Switch recording of FCP, TTFB, FID to web-vitals implementation in place of custom solution

## 3.2.0

### Minor Changes

- [#2478](https://github.com/Shopify/quilt/pull/2478) [`1570b951d`](https://github.com/Shopify/quilt/commit/1570b951d2f865120dcf7f198d23a4e935fe6042) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Add a new metric to track Largest Contentful Paint

## 3.1.1

### Patch Changes

- [#2459](https://github.com/Shopify/quilt/pull/2459) [`1f76ed324`](https://github.com/Shopify/quilt/commit/1f76ed324172fe90048423e7a0503b762d7424af) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Ignore invalid negative values for lifecycle metrics like Time to First Byte

## 3.1.0

### Minor Changes

- [#2413](https://github.com/Shopify/quilt/pull/2413) [`21435a256`](https://github.com/Shopify/quilt/commit/21435a2562822ef76d3ede49c8b1eaefc1fe475d) Thanks [@rorans](https://github.com/rorans)! - Introduce a RedirectDuration metric to get more specific server latency timings. This information will be sent via TTFB metadata. No changes need to be made on the consumer.

## 3.0.2

### Patch Changes

- [#2408](https://github.com/Shopify/quilt/pull/2408) [`2094cb39a`](https://github.com/Shopify/quilt/commit/2094cb39a674d38a19394b79bf59c11a65ff9e15) Thanks [@BPScott](https://github.com/BPScott)! - Internal typing adjustments as a result of updating Typescript

## 3.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.0.14 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.0.13 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]
- Remove devDependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 2.0.12 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.0.11 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.0.10 - 2021-11-30

- No updates. Transitive dependency bump.

## 2.0.9 - 2021-11-25

### Fixed

- Fixed the "Deprecated API for given entry type." warnings [[#2093](https://github.com/Shopify/quilt/pull/2093)]
- Fixed the "The PerformanceObserver does not support buffered flag with the entryTypes argument" warnings [[#2089](https://github.com/Shopify/quilt/pull/2089)]

## 2.0.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.0.7 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 2.0.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.0.5 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 2.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.3.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.10 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.2 - 2019-10-16

### Fixed

- `Performance` object constructor will now check if `PerformanceTiming` is supported. [[#1119](https://github.com/Shopify/quilt/pull/1119)]

## 1.2.1 - 2019-10-11

### Fixed

- `cacheEffectiveness` now assumes duration=0 is a cache hit [[#1107](https://github.com/Shopify/quilt/pull/1107)]

## 1.2.0 - 2019-10-03

### Changed

- Updated the README to include instructions on cleaning up listeners from `performance.on` [[#1081](https://github.com/Shopify/quilt/pull/1081)

### Added

- Added a new API `mark` to the `Performance` class. This encapsulates both checking for `supportsMarks` and calling `window.performance.mark` into one call. [[#1083]](https://github.com/Shopify/quilt/pull/1083/files)

## 1.1.2 - 2019-03-27

### Fixed

- Fixed an issue where changing only the hash/ query parameters would cause navigations to be recorded [[#610](https://github.com/Shopify/quilt/pull/610)]

## 1.1.1 - 2019-03-04

### Fixed

- Fixed an issue where events starting before the navigation would include the pre-navigation time in `Navigation#totalDurationByEventType` [[#549](https://github.com/Shopify/quilt/pull/549)]

## 1.1.0 - 2019-03-02

### Added

- New `fid` lifecycle event to track [first input delay](https://github.com/GoogleChromeLabs/first-input-delay) (to use this, consumers must inject [polyfill code](https://raw.githubusercontent.com/GoogleChromeLabs/first-input-delay/master/dist/first-input-delay.min.js) into their document head) [[#542](https://github.com/Shopify/quilt/pull/542)]

## 1.0.4 - 2019-02-21

### Fixed

- Fixed an issue where `Navigation#timeToUsable` did not account for when the navigation actually started, leading the values in the trillions [[#520](https://github.com/Shopify/quilt/pull/520)]

## 1.0.3 - 2019-01-11

### Fixed

- Fixed an issue where browsers supporting some custom timing types (but not `PerformanceObserver`) would throw while trying to create an instance of `PerformanceObserver`

## 1.0.2 - 2019-01-11

### Fixed

- The types for `Navigation#resourceEvents` no longer fails in consuming projects.

## 1.0.1 - 2019-01-11

### Fixed

- No longer fails if the browser does not have `window.performance`.

## 1.0.0 - 2019-01-30

First version.
