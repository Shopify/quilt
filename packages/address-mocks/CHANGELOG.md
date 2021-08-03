# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 2.0.5 - 2021-08-03

### Changed

- Update to latest sewiing-kit-next for build. Update `types`/`typeVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.4 - 2021-07-15

- No updates. Transitive dependency bump.

## 2.0.3 - 2021-06-29

- No updates. Transitive dependency bump.

## 2.0.1 - 2021-05-28

- Bumped `countries_en` fixture with latest country service data [#1920](https://github.com/Shopify/quilt/pull/1920)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.5.6 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.5.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.4.2 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.4.0 - 2020-09-02

- Updated mocks for countries and country calls to include `optionalLabels`. [#1610](https://github.com/Shopify/quilt/pull/1610)

## 1.3.0 - 2020-03-10

- Add mocks for request to CountryService with unsupported locales [#1301](https://github.com/Shopify/quilt/pull/1301)
