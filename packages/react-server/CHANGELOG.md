# Changelog

## 3.0.4

### Patch Changes

- Updated dependencies []:
  - @shopify/react-async@5.0.2
  - @shopify/react-html@12.0.2
  - @shopify/react-cookie@2.0.4
  - @shopify/react-hydrate@3.0.2
  - @shopify/react-network@5.0.4

## 3.0.3

### Patch Changes

- Updated dependencies [[`30005950b`](https://github.com/Shopify/quilt/commit/30005950baa33cf0ae7eda6d4fe1cc81fdb2ef70)]:
  - @shopify/network@3.2.0
  - @shopify/react-network@5.0.3
  - @shopify/sewing-kit-koa@9.0.2
  - @shopify/react-cookie@2.0.3

## 3.0.2

### Patch Changes

- Updated dependencies [[`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d)]:
  - @shopify/network@3.1.0
  - @shopify/react-network@5.0.2
  - @shopify/sewing-kit-koa@9.0.1
  - @shopify/react-cookie@2.0.2

## 3.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.13 - 2022-04-25

- No updates. Transitive dependency bump.

## 2.1.12 - 2022-03-31

- No updates. Transitive dependency bump.

## 2.1.11 - 2022-03-15

- No updates. Transitive dependency bump.

## 2.1.10 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.9 - 2022-03-07

- No updates. Transitive dependency bump.

## 2.1.8 - 2022-02-28

- No updates. Transitive dependency bump.

## 2.1.7 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.6 - 2022-02-14

### Changed

- Remove dependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 2.1.5 - 2022-02-09

- No updates. Transitive dependency bump.

## 2.1.4 - 2022-02-02

- No updates. Transitive dependency bump.

## 2.1.3 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.2 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.1 - 2022-01-19

- No updates. Transitive dependency bump.

## 2.1.0 - 2022-01-13

### Changed

- Update `koa-compose` to `4.1.0` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 2.0.2 - 2022-01-12

- No updates. Transitive dependency bump.

## 2.0.1 - 2021-12-07

- No updates. Transitive dependency bump.

## 2.0.0 - 2021-12-01

### Breaking Change

- Added support for webpack 5 and removed support for webpack 4 [[#2013](https://github.com/Shopify/quilt/pull/2013)]

## 1.2.11 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.2.10 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.2.9 - 2021-11-01

- No updates. Transitive dependency bump.

## 1.2.8 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.2.7 - 2021-09-14

- No updates. Transitive dependency bump.

## 1.2.6 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 1.2.5 - 2021-08-30

- No updates. Transitive dependency bump.

## 1.2.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.2.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 1.2.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.2.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.2.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 1.1.3 - 2021-06-29

- No updates. Transitive dependency bump.

## 1.1.2 - 2021-06-22

### Changed

- Include `setImmediate` in tests. [#1948](https://github.com/Shopify/quilt/pull/1948)

## 1.1.0 - 2021-06-08

### Changed

- Update `webpack-virtual-modules` to 0.4.3 which support webpack 5

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.21.8 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.21.4 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.21.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.20.1 - 2020-12-03

- Assign `ctx.state.quiltError` to exception caught after server error. ([#1667](https://github.com/Shopify/quilt/pull/1667))

## 0.20.0 - 2020-11-04

- Added `renderRawErrorMessage` to the options for `createRender` and `createServer`, controls rendering of raw stack or custom error page for SSR errors. Defaults to old behaviour, which is raw stack for development only.

## 0.19.0 - 2020-10-26

- Added `htmlProps` to the options for `createRender` and `createServer`, these props will be passed into the call to `@shopify/react-html`'s `<Html>` component ([#1661](https://github.com/Shopify/quilt/pull/1661))

## 0.18.4 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.18.0 - 2019-08-18

### Changed

- Allow `proxy` option to be specified by webpack plugin config (and forwarded to `createServer`). ([#1598](https://github.com/Shopify/quilt/pull/1598))

## 0.17.0 - 2019-08-18

### Added

- Add request_id, hostname, and ips as part of the log. ([#1579](https://github.com/Shopify/quilt/pull/1579)).

### Changed

- Change createServer default ip from `localhost` to `0.0.0.0` and remove 3000 as a default port. ([#1585](https://github.com/Shopify/quilt/pull/1585))

- Allow `proxy` and `app` options to be passed to `createServer`. ([#1591](https://github.com/Shopify/quilt/pull/1591))

## 0.16.0 - 2020-06-16

### Changed

- Move default options from webpack plugin into react-server. ([#1514](https://github.com/Shopify/quilt/pull/1514))

## 0.15.0 - 2020-06-06

### Changed

- 🛑 Replace `isomorphic-fetch` with `cross-fetch` as peer dependency. Consumer project should install `cross-fetch` in their project or use `@shopify/sewing-kit >= v0.131.0` ([#1497](https://github.com/Shopify/quilt/pull/1497))

## 0.14.0 - 2020-06-06

### Added

- Added `renderError` option to rendering a custom Error page on production SSR errors.

  - Note: If `renderError` is not set, the server returns a fallback error page as a sane default for production SSR errors.

- [webpack-plugin] Utilizes an `error` component if it exists at the root of `app/ui`. This component will be imported in the server source and passed to `@shopify/react-server`'s `renderError` option when creating a server. This will also create a virtual client entrypoint for the `error` component.

## 0.13.0 - 2020-06-04

### Changed

- Move `react-server-webpack-plugin` into `react-server` and expose it from `@shopify/react-server/webpack-plugin` ([#1489](https://github.com/Shopify/quilt/pull/1489))

## 0.12.0 - 2020-05-12

### Changed

- The `x-quilt-data` header is now serialized under the ID `quilt-data` rather than `x-quilt-data`

## 0.11.0 - 2020-05-04

### Changed

- Removed the providers that were previously exported. To our knowledge nothing used them and they offered little value. If cookie context is needed users can manually use `CookieUniversalProvider` from `@shopify/react-cookie`, and `CSRFProvider` should not be necessary with the new strategies provided by `quilt_rails`.

- Add: Serialize `x-quilt-data` received from the Rails server for use on the client ([#1411](https://github.com/Shopify/quilt/pull/1411))

## 0.10.0 - 2020-03-23

- Allow `assetName` to take a function for apps which need to serve multiple sub-apps based on path [[#1332]](https://github.com/Shopify/quilt/pull/1332)

## 0.9.0

- Added `assetName` option to allow the `name` to be passed and default to `main`

## 0.8.5 - 2019-11-29

- Updated dependency: `@shopify/sewing-kit-koa@6.2.0`

## 0.8.0 - 2019-10-30

- `createRender` now includes automatic sewing-kit-koa set-up. The `createRender` middleware now accepts an `assetPrefix` that is passed to `sewingKitKoa`'s middleware. [[#1160](https://github.com/Shopify/quilt/pull/1160)]

## 0.7.3 - 2019-09-30

- Added missing `@shopify/react-cookie` dependency

## 0.7.0 - 2019-09-12

- Added universal cookies support using `@shopify/react-cookie`. [#1002](https://github.com/Shopify/quilt/pull/1002)

## 0.6.0 - 2019-09-12

- Sets a `Server-Timing` response header with the duration of a request [#990](https://github.com/Shopify/quilt/pull/990)

- New Providers utlities:

#### `createDefaultProvider()`

This function return a set of providers based on a given the of options.

#### `<DefaultProvider />`

A single component that renders all of the providers required within a typical React application.

## 0.5.1 - 2019-09-11

- Add spacing between "[React Server]" prefix and logs [#984](https://github.com/Shopify/quilt/pull/984)

## 0.5.0 - 2019-09-11

### Added

- Improved logger to provide more readable production logs in Splunk [#978](https://github.com/Shopify/quilt/pull/978)

## 0.4.0 - 2019-09-06

### Fixed

- Server rendering no longer fails with erroneous errors about missing AsyncAssetContext / NetworkContext values [#969](https://github.com/Shopify/quilt/pull/969)

### Added

- Add rendering of `HydrationContext` by default [#969](https://github.com/Shopify/quilt/pull/969)

## 0.3.1 - 2019-08-29

### Fixed

- Now includes the full error stack as well as the error message when presenting SSR errors in development [#901](https://github.com/Shopify/quilt/pull/901)

## 0.3.0 - 2019-08-28

### Added

- Added `Options` object as the second argument to `createRender()` allowing passed in values for `afterEachPass` and `betweenEachPass` [#911](https://github.com/Shopify/quilt/pull/911)

## 0.2.0

### Changed

- `createRender` now passses the unchanged `Koa.Context` object.

## 0.1.6 - 2019-08-20

- actually passes in the headers from koa context into `NetworkManager`

## 0.1.5 - 2019-08-18

- logger middleware will fallback to `console` in render middleware

## 0.1.3

### Changed

- Improve error experience in development when server rendering fails [#850](https://github.com/Shopify/quilt/pull/850)

## 0.1.0

### Added

- `@shopify/react-server` package
