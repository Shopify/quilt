# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 0.5.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.5.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.4.4 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.4.0 - 2020-04-03

- Adding support for `X-Request-Start` header if it is prefix with `t=` ([#1352](https://github.com/Shopify/quilt/pull/1352))

## 0.3.6 - 2019-11-20

- Fix broken default export from 0.3.0 ([#1187](https://github.com/Shopify/quilt/pull/1187))

## 0.3.0 - 2019-10-07

- Use `@shopify/statd` instead of Metrics implementation. The log using logger in distribution was removed. ([#1074](https://github.com/Shopify/quilt/pull/1074))

## 0.2.0 - 2019-04-12

- Wrapping all the calls in a Promise and awaiting them at the end of the middleware.
- Remove .measure because it wasn't used anymore.
- Update hot-shots to support optional arguments for .distribution.
  ([#640](https://github.com/Shopify/quilt/pull/640))

## 0.1.12 - 2019-01-09

- Start of Changelog
