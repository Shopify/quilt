# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.9.0] - 2020-09-02

- Added `optionalLabels` to GraphQL query for countries and for country [(#1610)](https://github.com/Shopify/quilt/pull/1610)
- Minor update to `@shopify/address-consts` and minor update to `@shopify/address-mocks`. [(#1610)](https://github.com/Shopify/quilt/pull/1610)

## [2.8.0] - 2020-03-10

- Major update to `@shopify/address-consts` and minor update to @shopify/address-mocks

## [2.7.0] - 2019-08-14

### Added

- Added `provinceKey` to `Country` interface ([#843](https://github.com/Shopify/quilt/pull/843))

## [2.5.0] - 2019-01-08

- Removed `address2Key`, `zoneKey` and `zipKey`
- Expose `labels` on `Country` object that stores all translated labels needed to show a form.
- Rename `Province to`Zone`on FieldName enum, and renamed`Province`interface to`Zone`.

## [2.4.0] - 2018-10-11

- Expose testing helpers. ([#328](https://github.com/Shopify/quilt/pull/328))

## [2.3.0] - 2018-10-01

- Replaced `SupportedCountry` type by string. ([#322](https://github.com/Shopify/quilt/pull/322))

## [2.2.0] - 2018-10-01

- Replaced `SupportedLocale` type by string. Default to english, if locale does not exist. ([#321](https://github.com/Shopify/quilt/pull/321))

## [2.1.0] - 2018-09-28

- Created `SupportedLocale` type ([#311](https://github.com/Shopify/quilt/pull/311))
- Created `SupportedCountry` type ([#311](https://github.com/Shopify/quilt/pull/311))
- `AddressFormatter` now accepts `SupportedLocale` as locale instead of `string` ([#311](https://github.com/Shopify/quilt/pull/311))

## [2.0.0] - 2018-09-19

### Added

- Changed `address2Key: string` type to `Address2Key` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `zoneKey: string` type to `ProvinceKey` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `address2Key: string` type to `ZipKey` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Removed `attributes` key from Country type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `format` key to `formatting` in Country type ([#274](https://github.com/Shopify/quilt/pull/274))
