# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [2.8.0] - 2019-10-03

- Added the `Connection` class for to allow mocking `navigator.connection` in tests [#1083](https://github.com/Shopify/quilt/pull/1083/files)

## [2.7.1] - 2019-07-03

### Fixed

- Fixed bad default behaviour when specifying only a subset of an `IntersectionObserver` mock ([#762](https://github.com/Shopify/quilt/pull/762))

## [2.7.0] - 2019-06-24

### Added

- Accurate return types for `Storage` mocks

## [2.6.1] - 2019-04-25

### Fixed

- Now correctly declares a dependency on `@shopify/react-async`

### Added

- Added a mock for dimensions ([#625](https://github.com/Shopify/quilt/pull/625))

## [2.5.0] - 2019-03-28

### Added

- Added a mock for `Promise` ([#614](https://github.com/Shopify/quilt/pull/614))

## [2.4.0]

### Added

- Added a mock for `IntersectionObserver` and `requestIdleCallback` ([#576](https://github.com/Shopify/quilt/pull/576))

## [2.2.0]

### Added

- User timing mocks [#468](https://github.com/Shopify/quilt/pull/468).

## [2.1.3] - 2019-01-09

- Start of Changelog
