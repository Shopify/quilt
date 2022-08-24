# Changelog

## 5.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.0.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.0.4 - 2022-03-07

### Changed

- Export cjs by default for `babel` and `webpack`. [[#2193](https://github.com/Shopify/quilt/pull/2193)]

## 4.0.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.0.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.0.1 - 2022-02-01

- No updates. Transitive dependency bump.

## 4.0.0 - 2021-12-01

### Breaking Change

- Added support for webpack 5 and removed support for webpack 4 [[#2013](https://github.com/Shopify/quilt/pull/2013)]

## 3.0.3 - 2021-11-25

### Changed

- Update error messages to report `@shopify/web-worker`. [[#2088](https://github.com/Shopify/quilt/pull/2088)]

## 3.0.2 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.1 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.0 - 2021-11-08

### Changed

- Replaced this package with the contents of [`@remote-ui/web-workers`](https://github.com/Shopify/remote-ui/tree/main/packages/web-workers) as of version `1.5.7`. This change was made in order to deprecate `@remote-ui/web-workers`; anyone who was previously using that package should move to depending on this one (`@shopify/web-worker`) instead.

## 2.1.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.4 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 2.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

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
