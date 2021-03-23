# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [2.0.2] - 2021-03-23

### Changed

- Updated `jest` and `jest-simple` to not rely on cjs-only concepts [[#1788](https://github.com/Shopify/quilt/pull/1788)]

## [2.0.1] - 2021-03-16

### Changed

- Updated `jest` and `jest-simple` to be compatible with jest [[#1787](https://github.com/Shopify/quilt/pull/1787)]

## [2.0.0] - 2021-03-11

### Changed

- Renamed `webpack` entry point to `webpack-loader`

- Move from graphql-tools-web repo to quilt

## [1.3.0] - 2021-02-24

### Added

- Update dependencies (`jest`) to `26` [[#133](https://github.com/Shopify/graphql-tools-web/pull/133)]

## [1.2.0] - 2020-04-27

### Added

- Added a new `{simple: true}` option to the `graphql-mini-transforms/webpack` loader to produce GraphQL exports without any AST [[#114](https://github.com/Shopify/graphql-tools-web/pull/114)]
- Added a new `graphql-mini-transforms/jest-simple` transformer that produces the same shape as the webpack loader’s `simple` option [[#114](https://github.com/Shopify/graphql-tools-web/pull/114)]

## [1.1.0] - 2020-04-14

### Changed

- Update dependencies (`@types/webpack`) [[#110](https://github.com/Shopify/graphql-tools-web/pull/110)]
- Upgrade fs-extra to v9 [[#105](https://github.com/Shopify/graphql-tools-web/pull/105)]
- Upgrade prettier to `v2.0.4` and change `eslint-plugin-shopify` to `@shopify/eslint-plugin` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]
- Upgrade graphql to `v14.6.0` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]

## [1.0.3] - 2019-04-29

- Fixed issues with the Jest loader ([#81](https://github.com/Shopify/graphql-tools-web/pull/81))

## [1.0.2] - 2019-04-29

- Fixed issues with the Webpack loader when a document had one or more imports ([#80](https://github.com/Shopify/graphql-tools-web/pull/80))

## [1.0.0] - 2019-04-09

Initial release
