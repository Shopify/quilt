# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [0.0.4] - 2019-10-15

### Added

- `createWorker` now falls back to using the module directly in cases (like the test environment) where the value is not transformed into a script URL ([#1113](https://github.com/Shopify/quilt/pull/1113))
- `@shopify/web-worker/babel` now supports a `noop` mode (for generating a noop worker in environments that don’t support `Worker`, like the server) and properly restricts transformations to only relevant packages ([#1112](https://github.com/Shopify/quilt/pull/1112))

## [0.0.1] - 2019-10-07

Initial (pre-)release.
