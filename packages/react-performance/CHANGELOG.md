# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.4.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.4.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.3.7 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.3.0 - 2020-02-05

### Added

- Performance report hook and component now accepts a `locale` attribute [#1260](https://github.com/Shopify/quilt/pull/1260)

## 1.2.0 - 2019-10-25

### Added

- special values for `PerformanceMark`'s `stage` prop are now exposed as a `Stage` enum [#1137](https://github.com/Shopify/quilt/pull/1137)

## 1.1.0 - 2019-10-11

### Added

- creates a performance object as the default context value [#1102](https://github.com/Shopify/quilt/pull/1102)

## 1.0.0

### Added

- `@shopify/react-performance` package [#1083](https://github.com/Shopify/quilt/pull/1083)
