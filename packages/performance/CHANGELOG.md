# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
