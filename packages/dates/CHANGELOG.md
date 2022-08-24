# Changelog

## 2.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/decorators@3.0.1

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 1.1.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.1.4 - 2022-03-07

- No updates. Transitive dependency bump.

## 1.1.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 1.1.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.1.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.1.0 - 2022-01-28

### Added

- Added `format()` function, matching `moment().format`. [[#2135](https://github.com/Shopify/quilt/pull/2135)]

## 1.0.13 - 2022-01-06

- No updates. Transitive dependency bump.

## 1.0.12 - 2021-12-07

### Added

- Added getDateDiff and isPastDate functions [[#2099](https://github.com/Shopify/quilt/pull/2099)]

## 1.0.11 - 2021-12-01

- No updates. Transitive dependency bump.

## 1.0.10 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.0.9 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.0.8 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.0.7 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 1.0.6 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.0.5 - 2021-08-13

### Changed

- `formatDate`'s options object now expects its `hourCycle` value to be 'h11', 'h12', 'h23' or 'h24' rather than an arbitary string. Any other value would have caused an error at runtime, this helps us catch that error at compile time. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 1.0.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.0.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.0.2 - 2021-06-29

- No updates. Transitive dependency bump.

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.5.6 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.5.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.4.3 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.4.0 - 2020-06-04

### Added

- Added `isLessThanOneWeekAway` and `isLessThanOneYearAgo` functions [[#1438](https://github.com/Shopify/quilt/pull/1438)]

## 0.3.4 - 2020-03-13

### Added

- Added `getIanaTimeZone` and exposed `memoizedGetDateTimeFormat` ([#1367](https://github.com/Shopify/quilt/pull/1367))

## 0.3.1 - 2020-02-27

### Fixed

- Allows `hour12: true` to be passed to `formatDate` ([#1299](https://github.com/Shopify/quilt/pull/1299))

## 0.3.0 - 2020-02-19

- Export the `formatDate` function so it can be used by other packages / projects, e.g. in `@shopify/react-i18n` ([#1286](https://github.com/Shopify/quilt/pull/1286))

## 0.2.13 - 2020-02-07

- Fixes the memory leak that was introduced in v0.1.27 when server-side rendering ([#1277](https://github.com/Shopify/quilt/pull/1277))

## 0.2.12 - 2020-02-07

- ⚠️ A bug fix because Chrome 80's API change to Intl.DateTimeFormat ([#1266](https://github.com/Shopify/quilt/pull/1266))

## 0.2.11 - 2020-01-31

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## 0.2.0 - 2019-09-13

### Added

- Add `isLessThanOneMinute`, `isLessThanOneHour`, `isLessThanOneDay`, `isLessThanOneWeek`, and `isLessThanOneYear` functions ([#989](https://github.com/Shopify/quilt/pull/989))

## 0.1.15 - 2019-04-17

### Changed

- Improve performance of `formatDate` to use memoized `DateTimeFormat`. ([#643](https://github.com/Shopify/quilt/pull/643))

## 0.1.7 - 2019-01-09

- Start of Changelog
