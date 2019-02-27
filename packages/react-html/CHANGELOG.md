# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

<!-- Unreleased changes should go to UNRELEASED.md -->

---

<!-- ## Unreleased -->

## 7.1.1 - 2019-02-27

### Fixed

- Fixed an issue where `link`/ `meta` tags that were identical to previously-added tags would be removed and re-appended to `document.head` [#536](https://github.com/Shopify/quilt/pull/536)

## 7.1.0 - 2019-02-20

### Changed

- Changed body styles from `display: none` to `visisbility: hidden` while page loads in development. [#515](https://github.com/Shopify/quilt/pull/515)

## 7.0.1 - 2019-02-07

No changes

## 7.0.0 - 2019-02-04

### Changed

- Updated `@shopify/react-effect` to the newest version. While this should not have any breaking changes on consumers of this library, it does require you to update your use of `@shopify/react-effect`’s `extract` function to the latest version, which _is_ a breaking change. [#477](https://github.com/Shopify/quilt/pull/477)

## 6.2.0 - 2019-01-29

### Added

- Added metadata components: `AppleHomeScreen` and `Responsive`. [#481](https://github.com/Shopify/quilt/pull/481)

## 6.1.0 - 2019-01-24

### Added

- Added a `<Preconnect />` component, which deprecates `@shopify/react-preconnect`. [#479](https://github.com/Shopify/quilt/pull/479)

## 6.0.2 - 2019-01-09

- Start of Changelog
