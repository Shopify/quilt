# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

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
