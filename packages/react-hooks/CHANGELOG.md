# Changelog

## 3.0.2

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 3.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.19 - 2022-04-25

- No updates. Transitive dependency bump.

## 2.1.18 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.17 - 2022-03-07

- No updates. Transitive dependency bump.

## 2.1.16 - 2022-02-28

- No updates. Transitive dependency bump.

## 2.1.15 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.14 - 2022-02-14

- No updates. Transitive dependency bump.

## 2.1.13 - 2022-02-09

- No updates. Transitive dependency bump.

## 2.1.12 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.11 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.10 - 2022-01-19

- No updates. Transitive dependency bump.

## 2.1.9 - 2021-12-07

- No updates. Transitive dependency bump.

## 2.1.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.1.7 - 2021-11-22

- No updates. Transitive dependency bump.

## 2.1.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.5 - 2021-09-14

- No updates. Transitive dependency bump.

## 2.1.4 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 2.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

### Fixed

- `useMountedRef` now works with React 17 [#1964](https://github.com/Shopify/quilt/pull/1964).

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.13.1 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.13.0 - 2021-04-07

- Added `useIsomorphicLayoutEffect` hook [#1813](https://github.com/Shopify/quilt/pull/1813).
- Updated `useLazyRef` hook implementation to avoid mutating refs directly during the render phase, which is unsafe [#1813](https://github.com/Shopify/quilt/pull/1813).
- Updated `useTimeout` and `useInterval` hooks. Both of these hooks use mutable ref to hold on to the latest callback function. Now updating this ref synchronously to avoid stale callbacks being invoked [#1813](https://github.com/Shopify/quilt/pull/1813).

## 1.12.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.12.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.11.2 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.11.1 - 2020-08-19

### Fixed

- `useDelayedCallback` now uses `useRef` instead of `useState` in to avoid unnecessary re-render ([#1600](https://github.com/Shopify/quilt/pull/1600))
- Improved test case for `useDelayedCallback` ([#1601](https://github.com/Shopify/quilt/pull/1601))

## 1.11.0 - 2020-08-18

### Added

- Added `useDelayedCallback` hook ([#1595](https://github.com/Shopify/quilt/pull/1595))

## 1.10.0 - 2020-05-14

### Added

- Added `useForceUpdate` hook ([#1441](https://github.com/Shopify/quilt/pull/1441))

## 1.9.1 - 2020-05-01

### Fixed

- Add missing `useMediaLayout` export ([#1408](https://github.com/Shopify/quilt/pull/1408))

## 1.9.0 - 2020-04-23

### Added

- Added `useMediaLayout` hook ([#1396](https://github.com/Shopify/quilt/pull/1396))

## 1.8.0 - 2020-04-14

- Added a `useMedia` hook ([#1364](https://github.com/Shopify/quilt/pull/1364))

## 1.7.0 - 2020-04-08

### Added

- Added `useDebouncedValue` hook ([#1354](https://github.com/Shopify/quilt/pull/1354))

## 1.6.1 - 2020-04-07

### Fixed

- `useOnChangeValue` is now executed in an `useEffect` and doesn't block the render method anymore. **This fix may cause timing issue in your project if you depended on the change handler happening synchronously.**

## 1.6.0 - 2020-03-02

### Added

- Added support for `null` `delay` argument to `useTimeout`, to clear the timeout ([#1306](https://github.com/Shopify/quilt/pull/1306))

### Fixed

- Improved `useTimeout` hook, so it doesn't reset the timeout if the `callback` changes ([#1306](https://github.com/Shopify/quilt/pull/1306))

## 1.5.0 - 2020-03-12

- Added `useInterval` hook ([#1241](https://github.com/Shopify/quilt/pull/1241))

## 1.4.0 - 2019-12-19

- Added `useToggle` hook ([#1220](https://github.com/Shopify/quilt/pull/1220))

## 1.3.0 - 2019-10-29

- Added a `usePrevious` hook ([#1145](https://github.com/Shopify/quilt/pull/1145))

## 1.2.0 - 2019-04-25

- Added a `useMountedRef` hook ([#663](https://github.com/Shopify/quilt/pull/663))

## 1.1.0 - 2019-04-17

### Added

- Added a `useLazyRef` hook ([#659](https://github.com/Shopify/quilt/pull/659))

## 1.0.0 - 2019-04-12

### Added

- `@shopify/react-hooks` package with initial hooks for `useTimeout` and `useOnValueChange` ([#609](https://github.com/Shopify/quilt/pull/609))
