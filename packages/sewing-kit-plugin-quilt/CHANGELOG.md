# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 0.4.0 - 2021-08-10

### Breaking Change

- This package has been deprecated and removed. Webpack integration into sewing-kit-next shall be revisited once Webpack 5 in sewing-kit classic work is completed. [[#1991](https://github.com/Shopify/quilt/pull/1991)]

## 0.3.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 0.3.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 0.3.0 - 2021-06-22

### Changed

- Update `@sewing-kit/*` packages [#1948](https://github.com/Shopify/quilt/pull/1948)

## 0.2.1 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 0.2.0 - 2021-06-08

### Changed

- Update `webpack-virtual-modules` to 0.4.3 which support webpack 5

## 0.1.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)
