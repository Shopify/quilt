# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 2.0.3 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 2.0.1 - 2021-06-01

### Fixed

- Fix binary files referencing non-existent files [#1929](https://github.com/Shopify/quilt/pull/1929)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.0.2 - 2021-05-19

### Fixed

- Fix broken file exports. [#1894](https://github.com/Shopify/quilt/pull/1894)

## 1.0.1 - 2021-05-07

### Breaking Change

- Update `graphql-config` to version 3. Update `graphql-config-utilities`. [#1883](https://github.com/Shopify/quilt/pull/1883)

## 0.14.3 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.14.2 - 2021-03-23

### Fixed

- Fix `graphql-validate-fixtures` binary not running [[#1798](https://github.com/Shopify/quilt/pull/1798)]

## 0.14.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt
