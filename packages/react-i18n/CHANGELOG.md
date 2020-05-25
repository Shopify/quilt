# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

### Changed

- Updated `I18n#humanizeDate` to humanize today's date as `Today at {time}` [[#1459](https://github.com/Shopify/quilt/pull/1459)]

  Please see the [migration guide](./migration-guide.md) for more information.

## [3.0.0] - 2020-04-23

### Changed

- Modified `I18n#humanizeDate` to humanize future dates, specifically `Tomorrow at {time}` [[#1391](https://github.com/Shopify/quilt/pull/1391)]

  Please see the [migration guide](./migration-guide.md) for more information.

## [2.6.0] - 2020-04-20

### Changed

- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]

## [2.5.5] - 2020-04-13

### Fixed

- updated `memoizedNumberFormatter` to support all `Intl.NumberFormat` constructor inputs ([#1366](https://github.com/Shopify/quilt/pull/1366))

## [2.5.4] - 2020-04-09

### Added

- adding additional exports: `RegisterOptions`, `CurrencyFormatOptions`, `NumberFormatOptions`, `TranslateOptions`, `RootTranslateOptions`, `Replacements` ([#1365](https://github.com/Shopify/quilt/pull/1365))

### Fixed

- Updated `formatCurrency` to use `memoizedNumberFormatter` to eliminate memory leak ([#1310](https://github.com/Shopify/quilt/pull/1310))

## [2.5.3] - 2020-04-09

### Fixed

- Removed the unicode `RegExp` flag on `getCurrencySymbol` in order to support IE11 ([#1363](https://github.com/Shopify/quilt/pull/1363))

## [2.5.0] - 2020-04-02

### Added

- Add `defaultLocale` option to Babel plugin ([#1225](https://github.com/Shopify/quilt/pull/1225))
- Added `form: 'auto'` option to `formatCurrency`, to automatically select `short` or `explicit` based on `currency` and `defaultCurrency` ([#1350](https://github.com/Shopify/quilt/pull/1350))

## [2.4.1] - 2020-04-02

### Added

- Added korean eastern name formatter

## [2.4.0] - 2020-03-24

### Added

- Added `hasEasternNameOrderFormatter` method, to determine whether an Eastern name order formatter exists for the locale/language

## [2.3.10] - 2020-02-27

### Fixed

- Fixed memory leaks when server-side rendering for `Intl.DateTimeFormat.format()` and `Intl.NumberFormat.format()` ([#1287](https://github.com/Shopify/quilt/pull/1287))

- `formatCurrency` will now put the minus sign in front of the currency symbol when the amount is negative ([#1264](https://github.com/Shopify/quilt/pull/1264))

## [2.3.6] - 2020-02-04

### Fixed

- `MissingTranslationError` now uses the `normalizedId` which includes the `scope` ([#1258](https://github.com/Shopify/quilt/pull/1258))

## [2.3.4] - 2020-01-20

### Added

- Added `Gip` currency code value ([#1235](https://github.com/Shopify/quilt/pull/1235))

### Fixed

- Fixed `unformatNumber` for numbers using a period as the thousand separator ([#1215](https://github.com/Shopify/quilt/pull/1215))

## [2.3.0] - 2019-11-29

### Added

- Minor - added a `generateTranslationDictionaries` helper, and `mode=from-dictionary-index` option for the Babel plugin. This can be used to build many versions of an application, with each version containing a specific locale's translations directly within JavaScript ([#1197](https://github.com/Shopify/quilt/pull/1197/files))

## [2.2.0] - 2019-11-22

### Added

- Added a `generateTranslationIndexes` helper, and `mode=from-generated-index` option for the Babel plugin. This can be used to resolve unwanted cache hits when adding new translation files ([#1188](https://github.com/Shopify/quilt/pull/1188))

## [2.1.8] - 2019-11-15

### Fixed

- `translationKeyExists` on i18n works as expected with onError handler ([#1162](https://github.com/Shopify/quilt/pull/1162))

## [2.1.7] - 2019-11-12

### Added

- Added locale to be part of `MissingTranslationError` ([#1178](https://github.com/Shopify/quilt/pull/1178))

## [2.1.0] - 2019-10-07

### Added

- Added `memoizedPluralRules` utility function ([#1065](https://github.com/Shopify/quilt/pull/1065)
- Added `memoizedNumberFormatter` utility function ([#1065](https://github.com/Shopify/quilt/pull/1065)

### Changed

- Removed leading zero from hours of time output by `I18n#humanizeDate` method ([#1093](https://github.com/Shopify/quilt/pull/1093))

### Fixed

- Removed creation of `Intl.PluralRules` object from `I18n` constructor which caused backwards incompatibility for any platforms needing a polyfill for `Intl.Plualrules` support ([#1065](https://github.com/Shopify/quilt/pull/1065)

## [2.0.2] - 2019-09-27

### Added

- Added displayName to `withI18n` decorator to help with debugging ([#1048](https://github.com/Shopify/quilt/pull/1048))

## [2.0.1] - 2019-09-25

### Changed

- Fixed babel plugin incompatiblity with jest code coverage

## [2.0.0] - 2019-09-19

### Changed

- Modified translation keys used by `I18n#humanizeDate` method ([#1011](https://github.com/Shopify/quilt/pull/1011)).

  Please see the [migration guide](./migration-guide.md) for more information.

## [1.10.0] - 2019-09-18

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

### Changed

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
