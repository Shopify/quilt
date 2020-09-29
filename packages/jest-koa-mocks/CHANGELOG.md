# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [2.2.0] - 2019-12-19

### Added

- `Options` type is now exported for `createMockContext` [#1209](https://github.com/Shopify/quilt/pull/1209)

## [2.1.7] - 2019-10-23

### Fixed

- `createMockCookies` is now correctly exported [#595](https://github.com/Shopify/quilt/pull/595)

## [2.1.0] - 2019-01-18

### Fixed

- `createMockContext` output is now typed as `Koa.Context` so consumers don't need to cast [#453](https://github.com/Shopify/quilt/pull/453)

### Added

- `createMockContext` supports `rawBody` as a field [#453](https://github.com/Shopify/quilt/pull/453)

## [2.0.15] - 2019-01-11

- Fix setting custom state in mock context [#467](https://github.com/Shopify/quilt/pull/467)

## [2.0.14] - 2019-01-09

- Start of Changelog
