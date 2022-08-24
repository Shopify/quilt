# Changelog

## 4.0.6

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/address-consts@4.1.2

## 4.0.5

### Patch Changes

- Updated dependencies [[`0b3737b7d`](https://github.com/Shopify/quilt/commit/0b3737b7dc7531055b5cba7239a8210bb5e95f22)]:
  - @shopify/address-consts@4.1.1

## 4.0.4 - 2022-06-16

- No updates. Transitive dependency bump.

## 4.0.3 - 2022-05-31

- No updates. Transitive dependency bump.

## 4.0.2 - 2022-05-30

- No updates. Transitive dependency bump.

## 4.0.1 - 2022-05-27

- No updates. Transitive dependency bump.

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.2.0 - 2022-03-10

### Added

- Add `AddressFormatter.resetCache()` to be able to avoid caching side-effects [[#2179](https://github.com/Shopify/quilt/pull/2179)]

### Changed

- `getCountries` now checks the cache before fetching. Use the static `resetCache` method if you'd like to force a refetch. [[#2179](https://github.com/Shopify/quilt/pull/2179)]

## 3.1.1 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.1.0 - 2022-03-07

### Added

- Exposes `formatAddress`, `buildOrderedFields` formatting functions publicly so they can be used synchronously [[#2178](https://github.com/Shopify/quilt/pull/2178)]

## 3.0.16 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.0.15 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.0.14 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.0.13 - 2022-01-06

- No updates. Transitive dependency bump.

## 3.0.12 - 2021-12-01

- No updates. Transitive dependency bump.

## 3.0.11 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.10 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.9 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.8 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.7 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 3.0.6 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.5 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.4 - 2021-07-15

- No updates. Transitive dependency bump.

## 3.0.3 - 2021-06-29

- No updates. Transitive dependency bump.

## 3.0.1 - 2021-05-28

### Changed

- Updated `@shopify/address-mocks`

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.10.6 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.10.4 - 2021-04-07

### Changed

- Updated types within loader so it passes TypeScript's "noImplicitThis" checks. [#1814](https://github.com/Shopify/quilt/pull/1814)

## 2.10.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.10.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.9.2 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.9.0 - 2020-09-02

- Added `optionalLabels` to GraphQL query for countries and for country [(#1610)](https://github.com/Shopify/quilt/pull/1610)
- Minor update to `@shopify/address-consts` and minor update to `@shopify/address-mocks`. [(#1610)](https://github.com/Shopify/quilt/pull/1610)

## 2.8.0 - 2020-03-10

- Major update to `@shopify/address-consts` and minor update to @shopify/address-mocks
- Remove use of `toSupportedLocale` to default locale to `en` and let
  CountryService take care of the default `en` feature. [#1301](https://github.com/Shopify/quilt/pull/1301)

## 2.7.0 - 2019-08-14

### Added

- Added `provinceKey` to `Country` interface ([#843](https://github.com/Shopify/quilt/pull/843))

## 2.5.0 - 2019-01-08

- Removed `address2Key`, `zoneKey` and `zipKey`
- Expose `labels` on `Country` object that stores all translated labels needed to show a form.
- Rename `Province to`Zone`on FieldName enum, and renamed`Province`interface to`Zone`.

## 2.4.0 - 2018-10-11

- Expose testing helpers. ([#328](https://github.com/Shopify/quilt/pull/328))

## 2.3.0 - 2018-10-01

- Replaced `SupportedCountry` type by string. ([#322](https://github.com/Shopify/quilt/pull/322))

## 2.2.0 - 2018-10-01

- Replaced `SupportedLocale` type by string. Default to english, if locale does not exist. ([#321](https://github.com/Shopify/quilt/pull/321))

## 2.1.0 - 2018-09-28

- Created `SupportedLocale` type ([#311](https://github.com/Shopify/quilt/pull/311))
- Created `SupportedCountry` type ([#311](https://github.com/Shopify/quilt/pull/311))
- `AddressFormatter` now accepts `SupportedLocale` as locale instead of `string` ([#311](https://github.com/Shopify/quilt/pull/311))

## 2.0.0 - 2018-09-19

### Added

- Changed `address2Key: string` type to `Address2Key` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `zoneKey: string` type to `ProvinceKey` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `address2Key: string` type to `ZipKey` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Removed `attributes` key from Country type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `format` key to `formatting` in Country type ([#274](https://github.com/Shopify/quilt/pull/274))
