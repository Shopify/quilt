# Changelog

## 5.0.2

### Patch Changes

- Updated dependencies [[`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f)]:
  - @shopify/useful-types@5.1.0
  - @shopify/react-idle@3.0.2
  - @shopify/react-hydrate@3.0.2

## 5.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

### Fixed

- Explicitly type children in a component defined in a test [[#2266](https://github.com/Shopify/quilt/pull/2266)]

## 4.1.24 - 2022-04-25

- No updates. Transitive dependency bump.

## 4.1.23 - 2022-03-15

- No updates. Transitive dependency bump.

## 4.1.22 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.1.21 - 2022-03-07

- No updates. Transitive dependency bump.

## 4.1.20 - 2022-02-28

- No updates. Transitive dependency bump.

## 4.1.19 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.1.18 - 2022-02-14

### Changed

- Reduce usage of `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 4.1.17 - 2022-02-09

- No updates. Transitive dependency bump.

## 4.1.16 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.1.15 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.1.14 - 2022-01-19

- No updates. Transitive dependency bump.

## 4.1.13 - 2021-12-07

- No updates. Transitive dependency bump.

## 4.1.12 - 2021-12-01

- No updates. Transitive dependency bump.

## 4.1.11 - 2021-11-23

- No updates. Transitive dependency bump.

## 4.1.10 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 4.1.9 - 2021-11-01

- No updates. Transitive dependency bump.

## 4.1.8 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 4.1.7 - 2021-09-14

- No updates. Transitive dependency bump.

## 4.1.6 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 4.1.5 - 2021-08-30

- No updates. Transitive dependency bump.

## 4.1.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 4.1.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 4.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 4.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 4.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 4.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 3.2.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 3.2.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 3.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 3.1.24 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 3.1.20 - 2020-09-28

- Removed dependency on deprecated `@shopify/javascript-utilities` package ([#1560](https://github.com/Shopify/quilt/pull/1560))

## 3.1.16 - 2020-05-01

### Fixed

- Fixed a type issue with `usePreload`, `usePrefetch`, and `useKeepFresh` hook arguments ([#1404](https://github.com/Shopify/quilt/pull/1404))

## 3.1.0 - 2019-10-30

### Added

- Exported some additional types that can be useful for creating objects that can be used with `usePreload`, `usePrefetch`, and `useKeepFresh` ([#1153](https://github.com/Shopify/quilt/pull/1153)).

## 3.0.1 - 2019-07-04

### Fixed

- Fixed an issue where async components would not be immediately available during server rendering
- Added the missing dependencies for `@shopify/react-idle` and `@shopify/react-hydrate`

## 3.0.0 - 2019-07-03

Complete rewrite to support progressive hydration and hook-based prefetching. Please refer to the [migration guide](./documentation/migrations.md) for details.

## 2.3.0 - 2019-05-22

### Added

- Prefetching now happens on `touchdown` to improve perceived performance on touch devices ([#708](https://github.com/Shopify/quilt/pull/708))

## 2.2.0 - 2019-05-15

- Added a `useAsyncAsset` hook to register an identifier as used when not directly using the `Async` component ([#702](https://github.com/Shopify/quilt/pull/702))

## 2.1.0 - 2019-04-12

- Small refactor to export `resolve` utility ([#649](https://github.com/Shopify/quilt/pull/649))

## 2.0.0 - 2019-04-08

This library now requires React 16.8 because of changes to `@shopify/react-effect`.

## 1.3.0 - 2019-03-25

### Added

- Support the new `DeferTiming.InViewport` strategy ([#576](https://github.com/Shopify/quilt/pull/576))

## 1.2.2 - 2019-02-27

### Fixed

- The library now performs a more exhaustive obfuscation of `require` to reliably fool Webpack ([#537](https://github.com/Shopify/quilt/pull/537))

## 1.2.1 - 2019-02-26

### Fixed

- Fixed an issue where Webpack would complain about a dynamic `require` statement ([#533](https://github.com/Shopify/quilt/pull/533))

## 1.2.0 - 2019-02-25

### Changed

- `Async` now attempts to resolve the `id` of the component with a bare `require` call when it is available ([#530](https://github.com/Shopify/quilt/pull/530))

## 1.1.0 - 2019-02-15

### Added

- `createAsyncComponent` now accepts a `defer` property that dictates whether that component should wait until mount or idle to start loading the component ([#517](https://github.com/Shopify/quilt/pull/517))
- The component returned from `createAsyncComponent` and its static `Preload`, `Prefetch`, and `KeepFresh` components all accept an `async` prop that is an object with an optional `defer` property, which controls the way loading is done for just that element ([#517](https://github.com/Shopify/quilt/pull/517))

## 1.0.2 - 2019-02-10

### Fixed

- Fixed an issue where the `<Prefetcher />` would not watch user interactions by default.

## 1.0.1 - 2019-02-10

- Fixed some broken API choices

## 1.0.0 - 2019-02-07

- Initial release
