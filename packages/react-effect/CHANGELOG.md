# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2019-04-08

This library now requires React 16.8.

### Added

- Added a `useServerEffect` hook as an alternative to the `<Effect />` component ([#547](https://github.com/Shopify/quilt/pull/547))

## [2.1.0]

### Added

- Added a `maxPasses` option to `extract()` in order to limit the potential for infinite loops. This option defaults to 5 max render/ resolve cycles [#574](https://github.com/Shopify/quilt/pull/574)
- All `afterEachPass`/ `betweenEachPass` callbacks now receive an argument detailing the current pass index, whether the extraction process is complete, and the duration of the render/ resolve phases [#574](https://github.com/Shopify/quilt/pull/574)

## [2.0.0]

### Changed

- Removed `react-tree-walker` as a way to process the React element. Instead, the application is rendered to a string repeatedly until no more promises have been queued. For full details on migrating to the new API, please read the [upgrade guide](./documentation/migrating-version-1-to-2.md). [#477](https://github.com/Shopify/quilt/pull/477)

## [1.0.3]

- Manual release

## [1.0.1]

### Fixed

- Published the server entry point. [#410](https://github.com/Shopify/quilt/pull/410)

## [1.0.0]

Initial release
