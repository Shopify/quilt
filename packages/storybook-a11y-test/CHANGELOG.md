# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

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
