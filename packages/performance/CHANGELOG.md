# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2019-10-03

### Changed

- Updated the README to include instructions on cleaning up listeners from `performance.on` [[#1081](https://github.com/Shopify/quilt/pull/1081)

## Added

- Added a new API `mark` to the `Performance` class. This encapsulates both checking for `supportsMarks` and calling `window.performance.mark` into one call. [[#1083]](https://github.com/Shopify/quilt/pull/1083/files)

## [1.1.2] - 2019-03-27

### Fixed

- Fixed an issue where changing only the hash/ query parameters would cause navigations to be recorded [[#610](https://github.com/Shopify/quilt/pull/610)]

## [1.1.1] - 2019-03-04

### Fixed

- Fixed an issue where events starting before the navigation would include the pre-navigation time in `Navigation#totalDurationByEventType` [[#549](https://github.com/Shopify/quilt/pull/549)]

## [1.1.0] - 2019-03-02

### Added

- New `fid` lifecycle event to track [first input delay](https://github.com/GoogleChromeLabs/first-input-delay) (to use this, consumers must inject [polyfill code](https://raw.githubusercontent.com/GoogleChromeLabs/first-input-delay/master/dist/first-input-delay.min.js) into their document head) [[#542](https://github.com/Shopify/quilt/pull/542)]

## [1.0.4] - 2019-02-21

### Fixed

- Fixed an issue where `Navigation#timeToUsable` did not account for when the navigation actually started, leading the values in the trillions [[#520](https://github.com/Shopify/quilt/pull/520)]

## [1.0.3] - 2019-01-11

### Fixed

- Fixed an issue where browsers supporting some custom timing types (but not `PerformanceObserver`) would throw while trying to create an instance of `PerformanceObserver`

## [1.0.2] - 2019-01-11

### Fixed

- The types for `Navigation#resourceEvents` no longer fails in consuming projects.

## [1.0.1] - 2019-01-11

### Fixed

- No longer fails if the browser does not have `window.performance`.

## [1.0.0] - 2019-01-30

First version.
