# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [4.0.4] - 2020-10-23

- The `ApiVersion` enum now has an `October20` option. [#1654](https://github.com/Shopify/quilt/pull/1654)

## [4.0.3] - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [4.0.2] - 2020-09-28

### Fixed

- Delete cookie header before proxying GraphQL request ([#820](https://github.com/Shopify/quilt/pull/820))

## [4.0.0] - 2020-05-01

= The `ApiVersion` enum now has a `April20` and `July20` options

## [3.3.0] - 2020-02-19

= The `ApiVersion` enum now has a `January20` and `April20` options

## [3.2.0] - 2010-10-02

= The `ApiVersion` enum now has an `October19` option

## [3.1.0] - 2019-04-23

### Added

- The `ApiVersion` enum now has an `unversioned` option ([#665](https://github.com/Shopify/quilt/pull/665))

## [3.0.0] - 2019-04-10

### Added

- The factory to create a middleware now accepts a `version` option, which can be any member of the newly-exported `ApiVersion` enum ([#629](https://github.com/Shopify/quilt/pull/629))

## [2.1.5] - 2019-01-09

- Start of Changelog
