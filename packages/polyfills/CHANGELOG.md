# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Fix an issue with bundle size increased by ~20kb [#1518](https://github.com/Shopify/quilt/pull/1518)

## [1.2.0] - 2020-05-27

- Update polyfill base imports. [#1461](https://github.com/Shopify/quilt/pull/1461)

## [1.1.6] - 2019-01-12

- Update `package.json` published `files` patterns. [#1233](https://github.com/Shopify/quilt/pull/1233)

## [1.1.5] - 2019-11-25

- Fix `Can't resolve '@shopify/polyfills/<polyfill>'` import error [#1192](https://github.com/Shopify/quilt/pull/1192)

## [1.1.0] - 2019-08-08

- Use `url-polyfill` instead of `url-search-params-polyfill` as it polyfills `URL` as well, including `URL.searchParams`.

## [1.0.1] - 2019-08-07

- Updated `intl` polyfill featureTest from `internationalization-plural-rul` to `intl-pluralrules` as per the update in [`caniuse-lite@1.0.30000989`](https://github.com/ben-eb/caniuse-lite/commit/6966b0553f4584435a4c95a76794a93750a9004d#diff-5264ce81b24e867ed52dcca8f6a162fbR1)

## [1.0.0] - 2019-07-17

Initial release.
