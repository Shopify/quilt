# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 2.6.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.6.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.6.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.5.3 - 2020-12-08

- The `ApiVersion` enum now has an `October20` option. [#1697](https://github.com/Shopify/quilt/pull/1697)

## 2.5.2 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.5.1 - 2020-09-28

### Added

- The `ApiVersion` enum now has an `July20` option.

## 2.5.0 - 2020-08-20

- Add an option to register EventBridge webhooks to `registerWebhook`.

## 2.4.0 - 2020-02-19

- The `ApiVersion` enum now has an `January20` and `April20` options

## 2.3.0 - 2020-01-27

- Add [webhooks for billing](https://help.shopify.com/en/api/guides/billing-api#webhooks-for-billing) to topics

## 2.2.0 - 2019-11-08

### Added

- Add payload to webhook data for the `receiveWebhook` middleware ([#1168](https://github.com/Shopify/quilt/pull/1168)).

### Fixed

- Fixed a typo in the README ([#1167](https://github.com/Shopify/quilt/pull/1167)).

## 2.1.0 - 2019-10-03

- The `ApiVersion` enum now has an `October19` option

## 2.0.0 - 2019-09-26

_Breaking change_

- Added API version to GraphQL endpoint.

## 1.1.4 - 2019-03-29

- Check success via valid webhookSubscription field

## 1.1.3 - 2019-03-22

- Return a GraphQL formatted topic

## 1.1.2

- Added 1.1.1 version to CHANGELOG

## 1.1.1

### Fixed

- Fixed a typo in the README

## 1.1.0

### Changed

- Updates webhook registration to use GraphQL

## 1.0.1

### Fixed

- Fixed a typo in the README

## 1.0.0

### Added

- `@shopify/koa-shopify-webhooks` package
