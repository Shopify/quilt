# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 2.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.1.0 - 2021-06-08

### Changed

- Update `webpack-virtual-modules` to 0.4.3 which support webpack 5

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.5.5 - 2021-04-27

### Changed

- Updated webpack dependency to be ^4.25.1

## 1.5.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.5.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.4.2 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.4.0 - 2020-05-29

- Bump `webpack-virtual-modules` to `v0.2.2` [[#1484]](https://github.com/Shopify/quilt/pull/1484)

## 1.3.1 - 2019-11-12

### Fixed

- Fixed an issue where imports would not be processed by the Babel plugin if multiple values were imported from `@shopify/web-worker` or `@shopify/react-web-worker`.

## 1.3.0 - 2019-11-11

### Added

- This library now exports a `createPlainWorkerFactory` function, which can be used to create a function that will create `Worker` objects wrapping a module. This can be used in cases where the automatic wrapping of the worker in `@shopify/rpc` is not desirable ([#1174](https://github.com/Shopify/quilt/pull/1174)).
- The functions returned by `createWorkerFactory` and `createPlainWorkerFactory` now have a `url` property ([#1174](https://github.com/Shopify/quilt/pull/1174)).

### Fixed

- Fixed an issue with messages being lost when using the `createIframeWorkerMessenger` function ([#1174](https://github.com/Shopify/quilt/pull/1174)).

## 1.2.0 - 2019-11-08

### Changed

- Uses the new `@shopify/rpc` library for communication with the worker ([#1172](https://github.com/Shopify/quilt/pull/1172)).

### Added

- You can now supply an optional options object to the `createWorkerFactory` functions. One option is currently supported: `createMessenger`, which allows you to customize the message channel for the worker ([#1172](https://github.com/Shopify/quilt/pull/1172)).
- To support creating workers that are not treated as same-origin, the library now provides a `createIframeWorkerMessenger` function. This function is passed to the new `createMessenger` API, and works by creating a message channel directly from the host page to a worker in a sandboxed `iframe` ([#1172](https://github.com/Shopify/quilt/pull/1172)).

## 1.1.0 - 2019-10-21

### Added

- Multiple workers in a single app now get unique names automatically, and can provide an explicit name for the worker file using the `webpackChunkName` comment ([#1132](https://github.com/Shopify/quilt/pull/1132))

## 1.0.1 - 2019-10-18

### Fixed

- `terminate()` now releases the script created with `URL.createObjectURL()` alongside terminating the worker.

## 1.0.0 - 2019-10-18

### Changed

- `createWorker` has been renamed to `createWorkerFactory` ([#1129](https://github.com/Shopify/quilt/pull/1129)).

### Fixed

- Fixed additional issues with `retain` and `release` on deep structures ([#1129](https://github.com/Shopify/quilt/pull/1129)).

## 0.0.8 - 2019-10-18

### Fixed

- `createWorker` now works correctly when the webpack build uses only a pathname for `output.publicPath` ([#1126](https://github.com/Shopify/quilt/pull/1126)).
- `retain` and `release` now correctly deeply retain/ release objects and arrays.

## 0.0.4 - 2019-10-15

### Added

- `createWorker` now falls back to using the module directly in cases (like the test environment) where the value is not transformed into a script URL ([#1113](https://github.com/Shopify/quilt/pull/1113))
- `@shopify/web-worker/babel` now supports a `noop` mode (for generating a noop worker in environments that don’t support `Worker`, like the server) and properly restricts transformations to only relevant packages ([#1112](https://github.com/Shopify/quilt/pull/1112))

## 0.0.1 - 2019-10-07

Initial (pre-)release.
