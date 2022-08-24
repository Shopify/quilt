# Changelog

## 9.0.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/network@3.2.1

## 9.0.2

### Patch Changes

- Updated dependencies [[`30005950b`](https://github.com/Shopify/quilt/commit/30005950baa33cf0ae7eda6d4fe1cc81fdb2ef70)]:
  - @shopify/network@3.2.0

## 9.0.1

### Patch Changes

- Updated dependencies [[`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d)]:
  - @shopify/network@3.1.0

## 9.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 8.1.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 8.1.4 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 8.1.3 - 2022-02-02

- No updates. Transitive dependency bump.

## 8.1.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 8.1.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 8.1.0 - 2022-01-13

### Changed

- Update `koa-compose` to `4.1.0` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 8.0.0 - 2021-12-01

### Breaking Change

- Added support for webpack 5 and removed support for webpack 4 and removed support for the vendor dll. [[#2013](https://github.com/Shopify/quilt/pull/2013)]

## 7.0.9 - 2021-11-23

- No updates. Transitive dependency bump.

## 7.0.8 - 2021-11-22

- No updates. Transitive dependency bump.

## 7.0.7 - 2021-11-01

- No updates. Transitive dependency bump.

## 7.0.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 7.0.5 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 7.0.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 7.0.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 7.0.2 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 7.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 6.4.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)
- [Patch] Remove TypeScript type from distributed mjs [#1835](https://github.com/Shopify/quilt/pull/1835)

## 6.4.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 6.4.1 - 2021-02-03

### Changed

- Better ES module support via `Entrypoint`'s `js` assets containing an optional `type` key

## 6.4.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 6.3.6 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 6.3.0 - 2020-02-03

### Fixed

- [Minor] If the requested locale is not found, and only locale-specific manifests exist, return the fallback locale's most polyfilled assets [#1253](https://github.com/Shopify/quilt/pull/1253)
- [Patch] If the requested variant locale is not found, the parent locale's manifest will be returned [#1254](https://github.com/Shopify/quilt/pull/1254)

## 6.2.0 - 2019-11-29

### Added

- [Minor] If an `assets.json.gz` file exists, it will be read and unzipped ([1199](https://github.com/Shopify/quilt/pull/1199))
- [Minor] Manifests may now contain an `identity` attribute; this contains extra metadata about a manifest's support (e.g., locales) ([1199](https://github.com/Shopify/quilt/pull/1199))
- [Minor] A `locale` can now be passed to `assets` / `asyncAssets` / `script` / `style` helpers. If a locale is provided, and manifests with a matching `identity.locales` array are found, locale-specific assets will be returned.
  - Note: use `@shopify/react-i18n` and its `from-generated-index` mode to create locale-specific builds

## 6.1.0 - 2019-07-17

- [Minor] Adds configurable path/to/assets.json as `manifestPath` in the middleware options ([794](https://github.com/Shopify/quilt/pull/794))

## 6.0.1 - 2019-07-10

### Fixed

- The library now loads scripts in development, even when only styles are requested. This fixes the fact that, in development, there are no explicit styles, and they are instead injected by the associated script. ([#782](https://github.com/Shopify/quilt/pull/782))

## 6.0.0 - 2019-07-03

### Changed

- Removed a number of unnecessary methods from `assets`, and allowed passing identifiers for async assets that can selectively omit styles or scripts ([#762](https://github.com/Shopify/quilt/pull/762))

## 5.0.0 - 2019-06-07

- **Breaking Change:** The `assets` property is now only accessible via a new function, `getAssets(ctx: Context)`, and set via `setAssets(ctx: Context, assets: Assets)`. [#743](https://github.com/Shopify/quilt/pull/743)

## 4.0.0 - 2019-06-05

### Breaking Change

- Updates middleware's manifest parsing to support manifest changes made in [`@shopify/sewing-kit`](https://github.com/Shopify/sewing-kit/pull/1265) [#740](https://github.com/Shopify/quilt/pull/740)
  - **Requires a minimum version of `@shopify/sewing-kit@0.86.0`**

## 3.3.0 - 2019-05-01

### Added

- Added a method for accessing the persisted GraphQL manifest produced by sewing-kit>=0.82.0 [#630](https://github.com/Shopify/quilt/pull/630)

## 3.2.0 - 2019-02-11

### Added

- Added methods for accessing all assets, all async assets, and only async scripts/ styles for more advanced use cases.

## 3.1.0 - 2019-02-10

### Added

- `Assets#styles` and `Assets#scripts` now accept an optional `asyncAssets` option, which will be used to embed additional async bundles into the returned list

## 3.0.0 - 2019-01-18

### Fixed

- Output middleware is now typed correctly as a basic koa middleware instead of requiring a custom koa context [#453](https://github.com/Shopify/quilt/pull/453)

## 3.0.0

### Changed

- The `assetHost` option has been renamed to `assetPrefix` to make it more clear that you can supply a URL or path

## 2.0.1

### Changed

- Updated the internal mechanism of resolving manifests

## 2.0.0

### Changed

- The middleware now only supports the multi-client builds added in [version 0.68.0](https://github.com/Shopify/sewing-kit/pull/1096).

## 1.0.0

Initial release
