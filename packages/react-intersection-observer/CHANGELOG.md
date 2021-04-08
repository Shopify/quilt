# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.1.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.0.16 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.0.8 - 2019-10-31

- Change `useIntersection` hook behaviour to set and distribute the `IntersectionObserverEntry` object directly

## 2.0.0 - 2019-04-09

This library now requires React 16.8.

### Added

- Added a `useIntersection` hook as the preferred API ([#622](https://github.com/Shopify/quilt/pull/622))

## 1.0.0

Initial release.
