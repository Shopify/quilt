# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.2.0 - 2019-02-15

### Added

- `createAsyncQueryComponent` now accepts a `defer` property that dictates whether that component should wait until mount or idle to start loading the query ([#517](https://github.com/Shopify/quilt/pull/517))
- The component returned from `createAsyncQueryComponent` and its static `Preload`, `Prefetch`, and `KeepFresh` components all accept an `async` prop that is an object with an optional `defer` property, which controls the way loading is done for just that element ([#517](https://github.com/Shopify/quilt/pull/517))

## 1.1.0 - 2019-02-10

### Added

- Added some additional generic types for extracting default from queries.

## 1.0.1 - 2019-02-10

- Fixed some broken API choices

## 1.0.0 - 2019-02-07

- Initial release
