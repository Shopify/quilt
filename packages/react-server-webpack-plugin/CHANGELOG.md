# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

- Fix case where default entrypoints were generated for `client` and `server` when there were bespoke folders with index files present

## [2.2.0] - 2019-09-26

- Log errors on `uncaughtException` `unhandledRejection` events [#1006](https://github.com/Shopify/quilt/pull/1006)

## [2.1.1] - 2019-09-17

- Fixes an error regrding missing templates [#1006](https://github.com/Shopify/quilt/pull/1006)

## [2.1.0] - 2019-08-16

- Added support for Node projects [#917](https://github.com/Shopify/quilt/pull/917)
  - _Note:_ For Node apps the plugin relies on `app` being included in your webpack config's `resolve.modules`. For Rails apps, it relies on `app/ui`.

## [2.0.0] - 2019-08-16

- The plugin now defaults the `host` of the generated code to use `process.env.REACT_SERVER_IP` and the `port` to use `process.env.REACT_SERVER_PORT` when explicit values are not supplied. [#852](https://github.com/Shopify/quilt/pull/852)
- 💚 Increase test timeout [#849](https://github.com/Shopify/quilt/pull/849)

## [1.0.2] - 2019-08-14

- Remove unused `@shopify/koa-shopify-graphql-proxy` import [#847](https://github.com/Shopify/quilt/pull/847)

## [1.0.1] - 2019-08-13

- Upgrading to `react-server@^0.1.1`

## [1.0.0] - 2019-08-13

### Added

- `@shopify/react-server-webpack-plugin` package [#841](https://github.com/Shopify/quilt/pull/841)
