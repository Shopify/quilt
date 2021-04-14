# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 1.3.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.3.4 - 2021-04-07

### Changed

- Updated types within fetch.node so it passes TypeScript's "noImplicitThis" checks. [#1814](https://github.com/Shopify/quilt/pull/1814)

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.4 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.3 - 2020-06-30

- Fix an issue with bundle size increased by ~20kb [#1518](https://github.com/Shopify/quilt/pull/1518)

## 1.2.0 - 2020-05-27

- Update polyfill base imports. [#1461](https://github.com/Shopify/quilt/pull/1461)

## 1.1.6 - 2019-01-12

- Update `package.json` published `files` patterns. [#1233](https://github.com/Shopify/quilt/pull/1233)

## 1.1.5 - 2019-11-25

- Fix `Can't resolve '@shopify/polyfills/<polyfill>'` import error [#1192](https://github.com/Shopify/quilt/pull/1192)

## 1.1.0 - 2019-08-08

- Use `url-polyfill` instead of `url-search-params-polyfill` as it polyfills `URL` as well, including `URL.searchParams`.

## 1.0.1 - 2019-08-07

- Updated `intl` polyfill featureTest from `internationalization-plural-rul` to `intl-pluralrules` as per the update in [`caniuse-lite@1.0.30000989`](https://github.com/ben-eb/caniuse-lite/commit/6966b0553f4584435a4c95a76794a93750a9004d#diff-5264ce81b24e867ed52dcca8f6a162fbR1)

## 1.0.0 - 2019-07-17

Initial release.
