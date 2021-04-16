# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 1.6.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.6.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.6.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.5.1 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.5.0 - 2019-08-18

Added `ResponseType` function ([#1579](https://github.com/Shopify/quilt/pull/1573))

## 1.4.0 - 2019-06-27

- Added the following headers: 'X-XSS-Protection', 'X-Frame-Options', 'X-Download-Options', 'X-Content-Type-Options', 'Strict-Transport-Security', 'Referrer-Policy' ([#752](https://github.com/Shopify/quilt/pull/752))

## 1.3.0 - 2019-06-12

- Added 'Accept-Language' header ([#752](https://github.com/Shopify/quilt/pull/752))

## 1.2.2

- Manual release

## 1.0.1

### Added

- Added additional headers

## 1.0.0

Initial release
