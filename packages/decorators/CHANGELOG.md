# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.0.1 - 2019-03-11

### Bug Fix

- fix the bug where `memoize` will only remember result once per property definition. It will now memoize per instance. ([#567](https://github.com/Shopify/quilt/pull/567))

## 1.0.0 - 2019-03-7

### Added

- `@shopify/decorators` package with `memoize` decorator
