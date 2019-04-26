# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

## [1.2.0] - 2019-04-26

### Added

- Added `getTranslationTree` to get the translation tree from a key ([#645](https://github.com/Shopify/quilt/pull/645))

## [1.1.3] - 2019-04-17

### Fixed

- Fixed a number of performance issues with resolving asynchronous translations ([#659](https://github.com/Shopify/quilt/pull/659))

## [1.1.1] - 2019-04-12

### Changed

- `Weekdays` renamed to `Weekday` as part of `shopify/typescript/prefer-singular-enums` eslint rule ([#648](https://github.com/Shopify/quilt/pull/648))

## [1.1.0] - 2019-04-09

### Added

- Added a `useSimpleI18n` hook for performantly sharing an i18n instance within a React subtree ([#639](https://github.com/Shopify/quilt/pull/639))

### Fixed

- Improved the typing of `withI18n` to no longer mark the `i18n` prop as required ([#639](https://github.com/Shopify/quilt/pull/639))

## [1.0.0] - 2019-04-08

This library now requires React 16.8.

### Added

- Added a `useI18n` hook as the new first-class API ([#547](https://github.com/Shopify/quilt/pull/547))

### Changed

- Refactored the way parent/ child translations were stored, which should slightly improve performance ([#547](https://github.com/Shopify/quilt/pull/547))

## [0.11.9] - 2019-03-29

### Fixed

- Fixed an issue where the Babel plugin would return `Module` objects instead of the actual translation dictionaries [#618](https://github.com/Shopify/quilt/pull/618)

## [0.11.7] - 2019-03-27

### Changed

- Memoize `Intl.DateTimeFormat` and `Intl.NumberFormat` [#596](https://github.com/Shopify/quilt/pull/596)

## [0.11.5] - 2019-03-22

### Added

- Expose `currencyDecimalPlaces` and `DEFAULT_DECIMAL_PLACES` [#590](https://github.com/Shopify/quilt/pull/590)

## [0.11.3] - 2019-03-19

### Fixed

- Support unexpected usage of decimal symbols in `I18n#unformatCurrency` [#577](https://github.com/Shopify/quilt/pull/577)

## [0.11.1] - 2019-03-08

### Fixed

- Reverted a change that caused `I18n#getCurrencySymbol` to sometimes return an empty string

## [0.11.0] - 2019-03-07

### Added

- Added an optional `onError` field to the options for `I18nManager`, which controls how descendant `I18n` objects will respond to some types of recoverable errors [#550](https://github.com/Shopify/quilt/pull/550)

### Fixed

- Fixed an issue where `I18n` instances would be created with two copies of each translation dictionary when the locale was equal to the fallback locale [#553](https://github.com/Shopify/quilt/pull/553)

## [0.10.2] - 2019-02-13

### Fixed

- Babel plugin now correctly works without `filenameRelative` being passed via `opts`.

## [0.10.0] - 2019-02-11

### Added

- Babel plugin was added to auto-generate the arguments for `withI18n` when an adjacent `translations` folder exists [#505](https://github.com/Shopify/quilt/pull/505)

## [0.9.1] - 2019-02-06

### Changed

- `MissingTranslationError` now prints the missing translation as part of the message [#497](https://github.com/shopify/quilt/pull/497)

### Fixed

- Async translations that do not resolve to a translation dictionary are now serialized correctly [#494](https://github.com/shopify/quilt/pull/494)
- Multiple instances of the same component now reuse an inflight promise for translations [#498](https://github.com/Shopify/quilt/pull/498)

## [0.9.0] - 2019-02-04

### Changed

- Upgraded to the latest version of `react-effect`. This version has some breaking changes, but this does not actually change any API in `react-i18n`. [#477](https://github.com/Shopify/quilt/pull/477)

## [0.8.0] - 2019-01-30

### Added

- Add `unformatCurrency` utility to return the normalized value of formatted currency [#486](https://github.com/Shopify/quilt/pull/486)

## [0.7.4] - 2019-01-21

### Added

- `CurrencyCode` enum types [#473](https://github.com/Shopify/quilt/pull/473)

## [0.7.3] - 2019-01-21

### Added

- Format count when handling pluralized translation [#447](https://github.com/Shopify/quilt/pull/447)

## [0.7.2]

- Start of Changelog
