# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Remove duplicated metas without mutating the state [#1736](https://github.com/Shopify/quilt/pull/1736)

## [10.2.0] - 2021-02-03

### Changed

- Only render the last meta tag if they have same name or property [#1732](https://github.com/Shopify/quilt/pull/1732)

### Fixed

- Cleanup tags from DOM when unmounting [#1732](https://github.com/Shopify/quilt/pull/1732)

### Added

- Better ES module support via `<Html />`'s `script` / `blockingScripts` accepting a `type` property

## [10.1.0] - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## [10.0.2] - 2020-10-26

- Update `HtmlProps` to mark children as optional (same as any React component) and export it ([#1661](https://github.com/Shopify/quilt/pull/1661))

## [10.0.1] - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## [10.0.0] - 2020-10-09

### Changed

- The `<Script />` components is now exported from `@shopify/react-html/server` ([#1648](https://github.com/Shopify/quilt/pull/1648))
- The `<Style>` has been renamed for `<Stylesheet>` and is now exported from `@shopify/react-html/server` ([#1648](https://github.com/Shopify/quilt/pull/1648))

### Added

- New `useInlineStyle` hook to add inline `<style>` elements in the head of the document. ([#1648](https://github.com/Shopify/quilt/pull/1648))
- New `<InlineStyle />` component so you can add inline `<style>` elements in the head of the document. ([#1648](https://github.com/Shopify/quilt/pull/1648))
- Introduced new `inlineStyles` prop on the `<Html />` component to render inline`<style>` elements in the head of the document. ([#1648](https://github.com/Shopify/quilt/pull/1648))

## [9.3.0] - 2020-03-13

- Update `serialize-javascript@^3.0.0`. Solved an issue when you try to deserialize a non-JSON object by enforcing data to be serialized as a JSON object. ([#762](https://github.com/Shopify/quilt/pull/762))

## [9.2.2] - 2019-09-06

- Add missing `useLocale` export

## [9.2.0] - 2019-08-26

- New `useLocale` hook for setting the `lang` attribute on HTML

## [9.1.0] - 2019-08-26

### Added

- New `stream` function for returning a streamed HTML response from a React tree ([904](https://github.com/Shopify/quilt/pull/904))

## [9.0.1] - 2019-07-04

### Changed

- The `<Preconnect />` component now works for Safari users, at the expense of IE users. ([#776](https://github.com/Shopify/quilt/pull/776))

### Fixed

- Fixed an issue where async components would not be immediately available during server rendering
- Added the missing dependency for `@shopify/react-hydrate`

## [9.0.0] - 2019-07-03

### Changed

- Updated to integrate with the newest `@shopify/sewing-kit-koa` and `@shopify/react-hydrate` packages. There is a single breaking change that is documented in the [migration guide](./documentation/migration-version-8-to-9.md). ([#762](https://github.com/Shopify/quilt/pull/762))

## [8.1.1] - 2019-06-14

### Fixed

- The new features from 8.1.0 are now properly exported ([#753](https://github.com/Shopify/quilt/pull/753))

## [8.1.0] - 2019-06-11

### Added

- Added the `useBodyAttributes` hook and `<BodyAttributes />` component to allow setting additional props on the `body` element during server renders. ([#748](https://github.com/Shopify/quilt/pull/748))
- Added the `useHtmlAttributes` hook and `<HtmlAttributes />` component to allow setting additional props on the `body` element during server renders. ([#748](https://github.com/Shopify/quilt/pull/748))

## [8.0.9] - 2019-05-02

### Changed

- Removed the `isServer` option from the constructor for `HtmlManager` [#682](https://github.com/Shopify/quilt/pull/682)

## [8.0.6] - 2019-04-15

- The render of your app performed by the `Html` component now provides the `HtmlManager` instance, allowing it to access the serializations built up during `extract()` ([#655](https://github.com/Shopify/quilt/pull/655))

## [8.0.4] - 2019-04-12

- `useServerDomEffect` now returns a result ([#636](https://github.com/Shopify/quilt/pull/636))

## [8.0.3] - 2019-04-09

- Fixed `useTitle`, `useLink`, `useMeta`, `usePreconnect`, and `useFavicon` not being exported.

## [8.0.2] - 2019-04-09

- Fixed an issue where `<HeadUpdater />` would attempt to access browser globals on the server.

## [8.0.0] - 2019-04-08

This is a significant update that now requires at least React 16.8. You should refer to the [detailed migration guide](./documentation/migration-version-7-to-8.md) for additional guidance.

### Changed

- This library now requires at least React 16.8 ([#547](https://github.com/Shopify/quilt/pull/547))
- Removed `Provider`, exported the `HtmlContext` context object, exported a new `HeadUpdater` component for the client-side, and renamed `Manager` to `HtmlManager`.

### Added

- Added hook counterparts for most of the component APIs: `useSerialized`, `useTitle`, `useLink`, `useMeta`, `useFavicon`, and `usePreconnect` ([#547](https://github.com/Shopify/quilt/pull/547))

## [7.1.6] - 2019-03-27

### Changed

- Deferred scripts are now rendered in `<head>` [#605](https://github.com/Shopify/quilt/pull/605/files)

## [7.1.2] - 2019-03-02

### Fixed

- Removed the `title` and `favicon` props from `<Html />` because they did not have any effect on the rendered markup. Developers should include `<Title />` and `<Favicon />` components themselves instead.

## [7.1.1] - 2019-02-27

### Fixed

- Fixed an issue where `link`/ `meta` tags that were identical to previously-added tags would be removed and re-appended to `document.head` [#536](https://github.com/Shopify/quilt/pull/536)

## [7.1.0] - 2019-02-20

### Changed

- Changed body styles from `display: none` to `visisbility: hidden` while page loads in development. [#515](https://github.com/Shopify/quilt/pull/515)

## [7.0.1] - 2019-02-07

No changes

## [7.0.0] - 2019-02-04

### Changed

- Updated `@shopify/react-effect` to the newest version. While this should not have any breaking changes on consumers of this library, it does require you to update your use of `@shopify/react-effect`’s `extract` function to the latest version, which _is_ a breaking change. [#477](https://github.com/Shopify/quilt/pull/477)

## [6.2.0] - 2019-01-29

### Added

- Added metadata components: `AppleHomeScreen` and `Responsive`. [#481](https://github.com/Shopify/quilt/pull/481)

## [6.1.0] - 2019-01-24

### Added

- Added a `<Preconnect />` component, which deprecates `@shopify/react-preconnect`. [#479](https://github.com/Shopify/quilt/pull/479)

## [6.0.2] - 2019-01-09

- Start of Changelog
