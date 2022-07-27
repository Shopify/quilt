# Changelog

## 12.0.2

### Patch Changes

- Updated dependencies []:
  - @shopify/react-hydrate@3.0.2

## 12.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 12.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 11.1.23 - 2022-04-25

- No updates. Transitive dependency bump.

## 11.1.22 - 2022-03-31

### Changed

- Export missed server components [[#2228](https://github.com/Shopify/quilt/pull/2228)]

## 11.1.21 - 2022-03-15

- No updates. Transitive dependency bump.

## 11.1.20 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 11.1.19 - 2022-03-07

- No updates. Transitive dependency bump.

## 11.1.18 - 2022-02-28

- No updates. Transitive dependency bump.

## 11.1.17 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 11.1.16 - 2022-02-14

### Changed

- Remove dependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 11.1.15 - 2022-02-09

- No updates. Transitive dependency bump.

## 11.1.14 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 11.1.13 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 11.1.12 - 2022-01-19

- No updates. Transitive dependency bump.

## 11.1.11 - 2021-12-07

- No updates. Transitive dependency bump.

## 11.1.10 - 2021-11-23

- No updates. Transitive dependency bump.

## 11.1.9 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 11.1.8 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 11.1.7 - 2021-09-14

- No updates. Transitive dependency bump.

## 11.1.6 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 11.1.5 - 2021-08-30

- No updates. Transitive dependency bump.

## 11.1.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 11.1.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 11.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 11.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 11.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 11.0.2 - 2021-06-29

- No updates. Transitive dependency bump.

## 11.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 10.2.7 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 10.2.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 10.2.1 - 2021-02-10

### Fixed

- Remove duplicated metas without mutating the state [#1736](https://github.com/Shopify/quilt/ pull/1736)

## 10.2.0 - 2021-02-03

### Changed

- Only render the last meta tag if they have same name or property [#1732](https://github.com/Shopify/quilt/pull/1732)

### Fixed

- Cleanup tags from DOM when unmounting [#1732](https://github.com/Shopify/quilt/pull/1732)

### Added

- Better ES module support via `<Html />`'s `script` / `blockingScripts` accepting a `type` property

## 10.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 10.0.2 - 2020-10-26

- Update `HtmlProps` to mark children as optional (same as any React component) and export it ([#1661](https://github.com/Shopify/quilt/pull/1661))

## 10.0.1 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 10.0.0 - 2020-10-09

### Changed

- The `<Script />` components is now exported from `@shopify/react-html/server` ([#1648](https://github.com/Shopify/quilt/pull/1648))
- The `<Style>` has been renamed for `<Stylesheet>` and is now exported from `@shopify/react-html/server` ([#1648](https://github.com/Shopify/quilt/pull/1648))

### Added

- New `useInlineStyle` hook to add inline `<style>` elements in the head of the document. ([#1648](https://github.com/Shopify/quilt/pull/1648))
- New `<InlineStyle />` component so you can add inline `<style>` elements in the head of the document. ([#1648](https://github.com/Shopify/quilt/pull/1648))
- Introduced new `inlineStyles` prop on the `<Html />` component to render inline`<style>` elements in the head of the document. ([#1648](https://github.com/Shopify/quilt/pull/1648))

## 9.3.0 - 2020-03-13

- Update `serialize-javascript@^3.0.0`. Solved an issue when you try to deserialize a non-JSON object by enforcing data to be serialized as a JSON object. ([#762](https://github.com/Shopify/quilt/pull/762))

## 9.2.2 - 2019-09-06

- Add missing `useLocale` export

## 9.2.0 - 2019-08-26

- New `useLocale` hook for setting the `lang` attribute on HTML

## 9.1.0 - 2019-08-26

### Added

- New `stream` function for returning a streamed HTML response from a React tree ([904](https://github.com/Shopify/quilt/pull/904))

## 9.0.1 - 2019-07-04

### Changed

- The `<Preconnect />` component now works for Safari users, at the expense of IE users. ([#776](https://github.com/Shopify/quilt/pull/776))

### Fixed

- Fixed an issue where async components would not be immediately available during server rendering
- Added the missing dependency for `@shopify/react-hydrate`

## 9.0.0 - 2019-07-03

### Changed

- Updated to integrate with the newest `@shopify/sewing-kit-koa` and `@shopify/react-hydrate` packages. There is a single breaking change that is documented in the [migration guide](./documentation/migration-version-8-to-9.md). ([#762](https://github.com/Shopify/quilt/pull/762))

## 8.1.1 - 2019-06-14

### Fixed

- The new features from 8.1.0 are now properly exported ([#753](https://github.com/Shopify/quilt/pull/753))

## 8.1.0 - 2019-06-11

### Added

- Added the `useBodyAttributes` hook and `<BodyAttributes />` component to allow setting additional props on the `body` element during server renders. ([#748](https://github.com/Shopify/quilt/pull/748))
- Added the `useHtmlAttributes` hook and `<HtmlAttributes />` component to allow setting additional props on the `body` element during server renders. ([#748](https://github.com/Shopify/quilt/pull/748))

## 8.0.9 - 2019-05-02

### Changed

- Removed the `isServer` option from the constructor for `HtmlManager` [#682](https://github.com/Shopify/quilt/pull/682)

## 8.0.6 - 2019-04-15

- The render of your app performed by the `Html` component now provides the `HtmlManager` instance, allowing it to access the serializations built up during `extract()` ([#655](https://github.com/Shopify/quilt/pull/655))

## 8.0.4 - 2019-04-12

- `useServerDomEffect` now returns a result ([#636](https://github.com/Shopify/quilt/pull/636))

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
