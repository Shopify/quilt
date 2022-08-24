# Changelog

## 1.1.0

### Minor Changes

- [#2382](https://github.com/Shopify/quilt/pull/2382) [`80db75484`](https://github.com/Shopify/quilt/commit/80db7548499302d120be60916966d34703a94433) Thanks [@emiryy](https://github.com/emiryy)! - Add `waitUntil` setting in `testStories()` options parameter

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 1.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 1.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 0.5.1 - 2022-04-25

- No updates. Transitive dependency bump.

## 0.5.0 - 2022-04-06

### Changed

- Now requires storybook >6.4.0. Add support for storyStoreV7 mode. Reuse open browser instances instead of opening new browsers every time, which reduces memory pressure and makes the tests faster. [[#2194](https://github.com/Shopify/quilt/pull/2194)]

## 0.4.8 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 0.4.7 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 0.4.6 - 2022-02-09

### Changed

- Updated puppeteer to 13.2.0 ([#2162](https://github.com/Shopify/quilt/pull/2162))

## 0.4.5 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 0.4.4 - 2022-02-01

### Changed

- Updated puppeteer to 13.1.3 ([#2149](https://github.com/Shopify/quilt/pull/2149))
- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 0.4.3 - 2022-01-10

### Fixed

- Fixed a bug where animation wasn't getting totally cancelled out ([#2124](https://github.com/Shopify/quilt/pull/2124))

## 0.4.2 - 2022-01-07

### Fixed

- Fixed case where the script would errors when story parameters were undefined. [[#2119](https://github.com/Shopify/quilt/pull/2119)]

## 0.4.1 - 2022-01-07

### Fixed

- Added `@axe-core/puppeteer` as a direct dependency, rather than relying on consumers having it installed. [[#2116](https://github.com/Shopify/quilt/pull/2116)]

## 0.4.0 - 2022-01-06

### Changed

- Updated to use @axe-core/puppeteer for running tests to make it compatible with storybook 6.4.x. [[#2106](https://github.com/Shopify/quilt/pull/2106)]

## 0.3.0 - 2021-09-24

### Added

- Added ability to disable very specific rules to any single Story, using the same best practices as the ones described in <https://storybook.js.org/addons/@storybook/addon-a11y/> [[#2045](https://github.com/Shopify/quilt/pull/2045)]

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]
- Improved documentation and code quality [[#2045](https://github.com/Shopify/quilt/pull/2045)]
- Improved error messages to provide the ID of the violation [[#2045](https://github.com/Shopify/quilt/pull/2045)]
- Updated puppeteer to the latest version [[#2045](https://github.com/Shopify/quilt/pull/2045)]

## 0.2.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 0.2.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 0.2.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 0.2.0 - 2021-05-28

### Added

- Added the ability to disable transitions and animations [#1910](https://github.com/Shopify/quilt/pull/1910)

## 0.1.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.0.6 - 2021-04-27

### Added

- Added back the filtering of stories with `a11y: {disable: true}` parameter [#1866](https://github.com/Shopify/quilt/pull/1866)

## 0.0.5 - 2021-04-23

### Added

- Updated library to allow running axe test on specific story ids

## 0.0.3 - 2021-04-13

### Added

- Added timeout option [[#1859](https://github.com/Shopify/quilt/pull/1859)]

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.0.0

Initial release
