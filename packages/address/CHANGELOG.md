# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

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
