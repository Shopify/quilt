# Changelog

## 5.0.4

### Patch Changes

- Updated dependencies []:
  - @shopify/react-universal-provider@3.0.2

## 5.0.3

### Patch Changes

- Updated dependencies [[`30005950b`](https://github.com/Shopify/quilt/commit/30005950baa33cf0ae7eda6d4fe1cc81fdb2ef70)]:
  - @shopify/network@3.2.0

## 5.0.2

### Patch Changes

- Updated dependencies [[`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d)]:
  - @shopify/network@3.1.0

## 5.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.2.13 - 2022-04-25

- No updates. Transitive dependency bump.

## 4.2.12 - 2022-03-31

- No updates. Transitive dependency bump.

## 4.2.11 - 2022-03-15

- No updates. Transitive dependency bump.

## 4.2.10 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.2.9 - 2022-03-07

- No updates. Transitive dependency bump.

## 4.2.8 - 2022-02-28

- No updates. Transitive dependency bump.

## 4.2.7 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.2.6 - 2022-02-14

### Changed

- Remove devDependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 4.2.5 - 2022-02-09

- No updates. Transitive dependency bump.

## 4.2.4 - 2022-02-02

- No updates. Transitive dependency bump.

## 4.2.3 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.2.2 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.2.1 - 2022-01-19

- No updates. Transitive dependency bump.

## 4.2.0 - 2022-01-13

- No updates. Transitive dependency bump.

## 4.1.13 - 2022-01-12

### Changed

- Updated types to support nodes http IncomingHttpHeaders types [[#2127](https://github.com/Shopify/quilt/pull/2127)]

## 4.1.12 - 2021-12-07

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
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

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

## 4.0.2 - 2021-06-29

- No updates. Transitive dependency bump.

## 4.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 3.6.8 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 3.6.4 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 3.6.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 3.5.7 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 3.5.1 - 2020-06-22

### Fixed

- Fixes bug where empty cookies are still being set [#1517](https://github.com/Shopify/quilt/pull/1517)

## 3.5.0 - 2020-06-16

### Fixed

- Do not set `set-cookie` headers for incoming request cookies [#1515](https://github.com/Shopify/quilt/pull/1515)

## 3.4.0 - 2020-06-10

### Added

- Provide `NetworkUniversalProvider` component for universal access to network details. Currently only supports request headers. Previously `useRequestHeader` only had value on initial server-side renders

## 3.3.0

### Added

- The NetworkManager now accepts a `cookies` property in its constructor. This value is used to create a `ServerCookieManager` that can be accessed on the NetworkManger class instance. [#1002](https://github.com/Shopify/quilt/pull/1002)
- Added a new hook `useNetworkManager()` that returns the network manager. [#1002](https://github.com/Shopify/quilt/pull/1002)

## 3.2.0

- Added `useAcceptLanguage()` hook [#909](https://github.com/Shopify/quilt/pull/909)

## 3.1.10

### Fixed

- Store network headers in lowercase [#915](https://github.com/Shopify/quilt/pull/915)

## 3.1.2 - 2019-08-21

### Fixed

- `useRequestHeader` is now correctly case-insensitive [#889](https://github.com/Shopify/quilt/pull/8889)

## 3.1.1 - 2019-08-20

### Fixed

- `useRequestHeader` now works as documented when instantiated with `ctx.headers` [#888](https://github.com/Shopify/quilt/pull/888)

## 3.1.0 - 2019-06-14

### Added

- Added `useHeader` and `useRequestHeader` for interacting with network headers ([#747](https://github.com/Shopify/quilt/pull/747))

### Changed

- This library will now bail out of render passes in `react-effect` when a redirect is set ([#747](https://github.com/Shopify/quilt/pull/747))

## 3.0.4 - 2019-05-03

### Fixed

- Fixed a missing export for the `FrameSource` component ([#683](https://github.com/Shopify/quilt/pull/683))
- Fixed the `applyToContext` helper overwriting a content security policy when no directives were set ([#683](https://github.com/Shopify/quilt/pull/683))

## 3.0.0 - 2019-04-08

This library now requires React 16.8.

### Added

- Added hook versions of most component APIs: `useRedirect`, `useStatus`, and `useCspDirective` ([#547](https://github.com/Shopify/quilt/pull/547))

## 1.0.5

- Manual release

### Added

- `@shopify/react-network` package
