# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

<!-- Unreleased changes should go to UNRELEASED.md -->

---

## Unreleased

- useServerDomEffect now returns a result ([#636](https://github.com/Shopify/quilt/pull/636))

## 8.0.3 - 2019-04-09

- Fixed `useTitle`, `useLink`, `useMeta`, `usePreconnect`, and `useFavicon` not being exported.

## 8.0.2 - 2019-04-09

- Fixed an issue where `<HeadUpdater />` would attempt to access browser globals on the server.

## 8.0.0 - 2019-04-08

This is a significant update that now requires at least React 16.8. You should refer to the [detailed migration guide](./documentation/migration-version-7-to-8.md) for additional guidance.

### Changed

- This library now requires at least React 16.8 ([#547](https://github.com/Shopify/quilt/pull/547))
- Removed `Provider`, exported the `HtmlContext` context object, exported a new `HeadUpdater` component for the client-side, and renamed `Manager` to `HtmlManager`.

### Added

- Added hook counterparts for most of the component APIs: `useSerialized`, `useTitle`, `useLink`, `useMeta`, `useFavicon`, and `usePreconnect` ([#547](https://github.com/Shopify/quilt/pull/547))

## 7.1.6 - 2019-03-27

### Changed

- Deferred scripts are now rendered in `<head>` [#605](https://github.com/Shopify/quilt/pull/605/files)

## 7.1.2 - 2019-03-02

### Fixed

- Removed the `title` and `favicon` props from `<Html />` because they did not have any effect on the rendered markup. Developers should include `<Title />` and `<Favicon />` components themselves instead.

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
