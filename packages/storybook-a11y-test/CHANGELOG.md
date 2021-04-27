# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 0.0.6 - 2021-04-27

### Added

- Added back the filtering of stories with `a11y: {disable: true}` parameter [#1866](https://github.com/Shopify/quilt/pull/1866)
- Updated Puppeteer dependency to ^9.0.0
- Improved documentation
- Fixed default timeout to 30,000ms (30s) to match Puppeteer's actual default
- Added support for Axe’s [`configurationOptions`](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1) as `parameters.a11y.config` and [`runOptions`](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter) as `parameters.a11y.options`
- Added support for running tests against Storybook local instances
- Breaking change: the default way of running the tests now requires serving Storybook on `http://localhost:6006`

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
