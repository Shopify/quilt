# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

---

<!-- ## [Unreleased] -->

## [1.10.0] - 2019-09-17

### Added

- Added `ordinal` method to I18n class to translate ordinal numbers ([#1003](https://github.com/Shopify/quilt/pull/1003))

  Consumers will need to add the following translation keys for proper ordinal translation. _Note: values are English examples._

  ```json
  {
    "ordinal": {
      "one": "{number}st",
      "two": "{number}nd",
      "few": "{number}rd",
      "other": "{number}th"
    }
  }
  ```

## [1.9.2] - 2019-09-17

### Changed

- Replaced `@shopify/javascript-utilities/dates` functions with those from `@shopify/dates`.
- Removed `@shopify/javascript-utilities/dates` dependency.

### Fixed

- Fixed translation of weekday in `humanizeDate` for dates less than one week old.

## [1.9.1] - 2019-09-13

## Changed

- Updated to `@shopify/dates@^0.2.0`

## [1.9.0] - 2019-09-12

- Added support for pluralization to `getTranslationTree` ([#988](https://github.com/Shopify/quilt/pull/988))

## [1.8.3] - 2019-09-03

- Added `form:` option (one of `short` | `explicit`) to `formatCurrency()` ([#916](https://github.com/Shopify/quilt/pull/916))

## [1.7.0] - 2019-09-03

### Added

- Added `formatName` method to I18n class to format a first name and/or last name based on the locale used. ([#834](https://github.com/Shopify/quilt/pull/834))

## [1.6.0] - 2019-08-23

### Added

- Added an optional replacements argument to `getTranslationTree` ([#874](https://github.com/Shopify/quilt/pull/874))

## [1.5.1] - 2019-08-07

### Fixed

- Fixed an issue where async translations would sometimes not be shown on the initial mount of a component ([#824](https://github.com/Shopify/quilt/pull/824))

## [1.5.0] - 2019-07-02

### Added

- Added `loading` property to I18n class. This helps to determine loading states when retrieving translations async on apps that are rendered client-side.

## [1.4.0] - 2019-06-27

### Added

- Added `translationKeyExists` method for checking dynamic keys ([#766](https://github.com/Shopify/quilt/pull/766))

## [1.2.7] - 2019-06-12

### Fixed

- Added missing dependency for memoize function ([#746](https://github.com/Shopify/quilt/pull/746))

## [1.2.6] - 2019-06-05

### Changed

- The Babel plugin now fails when multiple components in a single file attempt to import translations, as this can cause build issues in Webpack ([#734](https://github.com/Shopify/quilt/pull/734))
- The Babel plugin now does not attempt to load asynchronous translations for locales do not have dedicated translation files ([#738](https://github.com/Shopify/quilt/pull/738))

## [1.2.5] - 2019-05-31

### Fixed

- Fixes transpilation for `babel-preset-typescript` when the last import pulls in only type definitions ([#699](https://github.com/Shopify/quilt/pull/699))

## [1.2.3] - 2019-05-09

### Fixed

- Now exports formerly missing typings for `TranslationDictionary` ([#693](https://github.com/Shopify/quilt/pull/693))

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
