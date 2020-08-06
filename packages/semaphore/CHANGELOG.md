# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

- Added new types of builds (CommonJS, ESM, esnext, Node) for greater tree-shakability

## [1.0.6] - 2020-04-21

### Fixed

- Fixed an issue with incorrect number of permits when the semaphore has multiple tries to be acquired, then released [[#1394](https://github.com/Shopify/quilt/pull/1394)]

## [1.0.0] - 2019-07-25

### Added

- `@shopify/semaphore` package
