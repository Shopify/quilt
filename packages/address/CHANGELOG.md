# Changelog

All notable changes to this project will be documented in this file.

The format is based on [these versioning and changelog guidelines](https://git.io/polaris-changelog-guidelines).

<!-- Unreleased changes should go to UNRELEASED.md -->

---

## 2.0.0 - 2018-09-19

### Enhancements

- Changed `address2Key: string` type to `Address2Key` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `zoneKey: string` type to `ProvinceKey` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `address2Key: string` type to `ZipKey` type ([#274](https://github.com/Shopify/quilt/pull/274))
- Removed `attributes` key from Country type ([#274](https://github.com/Shopify/quilt/pull/274))
- Changed `format` key to `formatting` in Country type ([#274](https://github.com/Shopify/quilt/pull/274))
- Created `SupportedLocale` type ([#311](https://github.com/Shopify/quilt/pull/311))
- Created `SupportedCountry` type ([#311](https://github.com/Shopify/quilt/pull/311))
- `AddressFormatter` now accepts `SupportedLocale` as locale instead of `string` ([#311](https://github.com/Shopify/quilt/pull/311))
