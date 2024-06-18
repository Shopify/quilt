# Changelog

## 5.2.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

## 5.1.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

### Patch Changes

- Updated dependencies [[`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece)]:
  - @shopify/async@4.1.0

## 5.0.1

### Patch Changes

- Updated dependencies [[`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47)]:
  - @shopify/async@4.0.4

## 5.0.0

### Major Changes

- [#2642](https://github.com/Shopify/quilt/pull/2642) [`db05ac6d1`](https://github.com/Shopify/quilt/commit/db05ac6d1fc57a126d30cf50476dd92d279974ea) Thanks [@BPScott](https://github.com/BPScott)! - Replace `lolex` with using Jest's built-in clock mocking, available since Jest 26. Internally Jest uses `@sinon/fake-timers` which is the API-compatible successor to `lolex`.

  As of Jest 26, the functionality of the Clock and Timer mocks are built into Jest. We recommend replacing usage of these mocks with calling jest directly:

  - Replace `clock.mock()` and `timer.mock()` with `jest.useFakeTimers()`
  - Replace `clock.restore()` and `timer.restore()` with `jest.useRealTimers()`
  - Replace `clock.tick(time)` with `jest.advanceTimersByTime(time)`
  - Replace `clock.setTime(time)` with `jest.setSystemTime(time)`
  - Replace `timer.runAllTimers()` with `jest.runAllTimers()`
  - Replace `timer.runTimersToTime()` with `jest.advanceTimersByTime()`

  You may encounter problems if you try to use the Clock and Timer mocks in the same file. We suggest migrating away from both of them, and replacing them with Jest's own mocking behaviour.

## 4.2.0

### Minor Changes

- [#2619](https://github.com/Shopify/quilt/pull/2619) [`d1b6a3c02`](https://github.com/Shopify/quilt/commit/d1b6a3c0264abfc232166638df8a88164d6db8a3) Thanks [@bryanparadis](https://github.com/bryanparadis)! - Add `keys` function to Storage mock

## 4.1.2

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

- Updated dependencies [[`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86)]:
  - @shopify/async@4.0.3

## 4.1.1

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

- Updated dependencies [[`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f)]:
  - @shopify/async@4.0.2

## 4.1.0

### Minor Changes

- [#2409](https://github.com/Shopify/quilt/pull/2409) [`0bff6fad7`](https://github.com/Shopify/quilt/commit/0bff6fad7b0630d1b796bb457d8d86e81ececedd) Thanks [@BPScott](https://github.com/BPScott)! - Update types to account changes in TypeScript 4.8 and 4.9. [Propogate contstraints on generic types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to) and update type usage relating to `Window` and `Navigator`. Technically this makes some types stricter, as attempting to pass `null|undefined` into certain functions is now disallowed by TypeScript, but these were never expected runtime values in the first place.

## 4.0.2

### Patch Changes

- [#2408](https://github.com/Shopify/quilt/pull/2408) [`2094cb39a`](https://github.com/Shopify/quilt/commit/2094cb39a674d38a19394b79bf59c11a65ff9e15) Thanks [@BPScott](https://github.com/BPScott)! - Update typing of Connection mock so it includes `addEventListener`, `removeEventListener`, `dispatchEvent` and `type`

## 4.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/async@4.0.1

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.0.16 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.0.15 - 2022-03-07

- No updates. Transitive dependency bump.

## 3.0.14 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.0.13 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.0.12 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.0.11 - 2022-01-06

### Changed

- Added `length` prop to storage mock [[#2107](https://github.com/Shopify/quilt/pull/2107)]

## 3.0.10 - 2021-12-01

- No updates. Transitive dependency bump.

## 3.0.9 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.8 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.7 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.6 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.5 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 3.0.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.2 - 2021-06-29

### Fixed

- Dimension mocks no longer leak invalid values into other tests after being restored. [[#1961](https://github.com/Shopify/quilt/pull/1961)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.11.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.11.4 - 2021-04-07

### Changed

- Updated match-media mock so it passes TypeScript's "strictPropertyInitialization" checks. [#1814](https://github.com/Shopify/quilt/pull/1814)

## 2.11.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.10.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698

## 2.9.4 - 2020-12-08

### Added

- Updated `fetch-mock` dependency to `^9.11.0`. [#1691](https://github.com/Shopify/quilt/pull/1691)

### Fixed

- Fixed broken `location` module and re-enabled tests [#1684](https://github.com/Shopify/quilt/pull/1684)

## 2.9.3 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.9.2 - 2020-10-09

### Added

- `fetch-mock` is updated to the latest version [#1510](https://github.com/Shopify/quilt/pull/1510)

  Please see the [migration guide](./migration-guide.md) for more information.

## 2.9.1 - 2020-05-05

### Added

- Fixed setup instructions instructions for `ensureMocksReset`

## 2.9.0 - 2020-04-23

- Added mock for `innerWidth` to dimensions ([#1399](https://github.com/Shopify/quilt/pull/1399))

## 2.8.0 - 2019-10-03

- Added the `Connection` class for to allow mocking `navigator.connection` in tests [#1083](https://github.com/Shopify/quilt/pull/1083/files)

## 2.7.1 - 2019-07-03

### Fixed

- Fixed bad default behaviour when specifying only a subset of an `IntersectionObserver` mock ([#762](https://github.com/Shopify/quilt/pull/762))

## 2.7.0 - 2019-06-24

### Added

- Accurate return types for `Storage` mocks

## 2.6.1 - 2019-04-25

### Fixed

- Now correctly declares a dependency on `@shopify/react-async`

### Added

- Added a mock for dimensions ([#625](https://github.com/Shopify/quilt/pull/625))

## 2.5.0 - 2019-03-28

### Added

- Added a mock for `Promise` ([#614](https://github.com/Shopify/quilt/pull/614))

## 2.4.0

### Added

- Added a mock for `IntersectionObserver` and `requestIdleCallback` ([#576](https://github.com/Shopify/quilt/pull/576))

## 2.2.0

### Added

- User timing mocks [#468](https://github.com/Shopify/quilt/pull/468).

## 2.1.3 - 2019-01-09

- Start of Changelog
