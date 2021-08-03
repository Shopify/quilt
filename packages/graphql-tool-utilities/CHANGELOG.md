# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Update to latest sewiing-kit-next for build. Update `types`/`typeVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)
- Removed core-js dependency, as its polyfills are no longer needed in node 12. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.4.2 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.4.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt

## 1.3.0 - 2020-12-03

- Updated dependency: `core-js@^3.0.0`.

## 1.2.0 - 2019-04-22

- Start of Changelog
