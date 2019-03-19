# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

---

<!-- ## [Unreleased] - -->

## [0.11.2] - 2019-03-19

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
