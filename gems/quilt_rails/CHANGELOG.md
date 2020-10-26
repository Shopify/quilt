# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

### Changed

- Deprecate `Quilt::Logger.log` in favour of `Quilt.logger`. ([#1611](https://github.com/Shopify/quilt/pull/1611))

## [3.4.0] - 2020-08-26

### Added

- Passed `X-Request-ID` header to the Node server by default. ([#1608](https://github.com/Shopify/quilt/pull/1608))

## [3.3.1] - 2020-08-10

### Added

- Added `config.mount` (default `true`) option to disable automatic engine mounting.
  ([#1605](https://github.com/Shopify/quilt/pull/1605))

## [3.3.0] - 2020-08-10

### Added

- Added automatic route mounting for `Quilt::Engine` that is easily overridable within the main application.
  ([#1576](https://github.com/Shopify/quilt/pull/1576))

- Added a custom error page for `Quilt::ReactRenderable::ReactServerNoResponseError` that automatically refreshes until the react server has started.
  ([#1566](https://github.com/Shopify/quilt/pull/1566))

## [3.2.1] - 2020-07-15

### Added

- Added a `--skip-yarn` option when running the `bin/rails generate sewing_kit:install` generator. This option is mostly
  using for tools to control when yarn dependencies get installed in the case where you implemented a caching mechanism.
  ([#1552](https://github.com/Shopify/quilt/pull/1552))

## [3.1.1] - 2020-06-24

### Fixed

- Fix typo in [error message](https://github.com/Shopify/quilt/blob/fefe904fe6e59f11c59092e523f6ee63ba1fd09d/gems/quilt_rails/lib/quilt_rails/react_renderable.rb#L56). ([#1528](https://github.com/Shopify/quilt/pull/1528))

## [3.1.0] - 2020-06-17

### Changed

- Remove automatic passing of `X-CSRF-Token` in the header. With [csrf header strategy](./README.md#fixing-rejected-csrf-tokens-for-new-user-sessions) you should not need this value for GraphQL request. If absolutely needed, use [custom headers method](./README.md#example:-sending-custom-headers-from-rails-controller) to pass the value manually. ([#1509](https://github.com/Shopify/quilt/pull/1509))

- Remove installation of `@shopify/react-server` from the generator. ([#1509](https://github.com/Shopify/quilt/pull/1509))

### Added

- Added setting of the javascript path in generator ([#1509](https://github.com/Shopify/quilt/pull/1509))

## [3.0.0] - 2020-06-10

### Changed

- `data` header now only contains "data", and omits any custom headers passed into `render_react`. Consumers of this gem are encouraged to use the new `NetworkUniversalProvider` in `@shopify/react-network` to access headers on client-side renders

## [2.0.0] - 2020-06-08

### Changed

- Move SewingKit generator task into sewing-kit. The generator command remains the same. ([#1494](https://github.com/Shopify/quilt/pull/1494))

### Removed

- Remove generator task `quilt_rails:install`. The generator command remains the same. ([#1494](https://github.com/Shopify/quilt/pull/1494))

## [1.13.0] - 2020-06-2

### Changed

- Refactor generators into smaller tasks. ([#1449](https://github.com/Shopify/quilt/pull/1449))
- Lock the version of `react`, `react-dom` and `typescript`
  ([#1449](https://github.com/Shopify/quilt/pull/1449))

### Added

- Added the generation of a few more configuration files `.editorconfig`, `.eslintignore`, `.prettierignore` ([#1449](https://github.com/Shopify/quilt/pull/1449))
- Added a default `package.json` file ([#1449](https://github.com/Shopify/quilt/pull/1449))
- Added the ability to grab application name from Rails setting for `package.json` & `sewing-kit.config` ([#1449](https://github.com/Shopify/quilt/pull/1449))

## [1.12.2] - 2020-05-19

- Fixed: Performance endpoint now parses `text/plain` report data as JSON

## [1.12.1] - 2020-05-14

- Fixed: Performance endpoint now accepts data that lacks a `connection` parameter, replacing it with a stand-in value

## [1.12.0] - 2020-05-07

- Add: Expose a `data` argument on `render_react` to share data to the React server using the `X-Quilt-Data` header ([#1411](https://github.com/Shopify/quilt/pull/1411))

⚠️ this change has the minimal requirement of `@shopify/react-server` v0.12.0 and `@shopify/react-server-webpack-plugin` v3.0.0 (or `@shopify/sewing-kit` v0.128.0)

## [1.11.1] - 2020-03-24

- add `allowed_push_host` in gemspec that is required to publish

## [1.11.0] - 2020-03-24

- Custom CSRF strategy to allow requests containing an `x-shopify-react-xhr: 1` header, deprecating the old custom CSRF strategy which was intended for use only in server rendering in favour of one for use both on the server and client. [#1331](https://github.com/Shopify/quilt/pull/1331)

## [1.10.0] - 2019-01-30

- The `Quilt::ReactRenderable` method `render_react` now accepts a header argument that gets passed through the reverse proxy

## [1.9.2] - 2019-12-10

## Changed

- Bumped `statsd-instruments` gem to version `2.8` [#1152](https://github.com/Shopify/quilt/pull/1152)

## [1.9.1] - 2019-10-24

### Fixed

- The `Quilt::Performance::Reportable` module no longer breaks when including tags in distributions in production.

## [1.9.0] - 2019-10-23

## Added

- The new `Quilt::Performance` module provides tools for parsing performance reports sent by `@shopify/react-performance` and sending distributions to StatsD servers.

## [1.8.0] - 2019-09-25

### Fixed

- Quilt generator now adds `typescript`, `react`, `react-dom`, and types as project dependencies [#1038](https://github.com/Shopify/quilt/pull/1038)
- Quilt generator now adds a `tsconfig.json` [#1038](https://github.com/Shopify/quilt/pull/1038)
- Quilt generator now avoids warnings about `--isolated-modules` by using ES export syntax [#1038](https://github.com/Shopify/quilt/pull/1038)
- Quilt generated apps no longer start up with exceptions about `app/ui/App.tsx` being uncompilable [#1038](https://github.com/Shopify/quilt/pull/1038)

## [1.7.0] - 2019-09-23

### Fixed

- The Node server calling Rails controllers no longer blocks first page load [#1020](https://github.com/Shopify/quilt/pull/1020)
- The Node server calling Rails controllers no longer blocks page loads after changing an `.rb` file [#1020](https://github.com/Shopify/quilt/pull/1020)

## [1.6.0] - 2019-09-18

### Added

- Custom CSRF strategy to allow server-side requests containing an `X-Shopify-Server-Side-Rendered: 1` header [#1004](https://github.com/Shopify/quilt/pull/1004)

## [1.5.0] - 2019-09-04

### Added

- Now fails fast with an improved error message suggesting proper testing practices when used in a test, rather than giving a confusing error aimed at development flows [#944](https://github.com/Shopify/quilt/pull/944)

## [1.4.1] - 2019-08-22

### Fixed

- No longer breaks when used with `ShopifySecurityBase` [#896](https://github.com/Shopify/quilt/pull/896)

## [1.4.0] - 2019-08-21

### Added

- Always include csrf token for quilt rails requests [#887](https://github.com/Shopify/quilt/pull/887)

## [1.3.3] - 2019-08-20

### Fixed

- Raise a more meaningful error message when React server is ready/configured properly [#870](https://github.com/Shopify/quilt/pull/870)

## [1.3.2] - 2019-08-20

- Fix rails index route typo

## [1.3.1] - 2019-08-20

- Converted `quilt_rails` to an Engine ([840](https://github.com/Shopify/quilt/pull/840))
- Added generators for `quilt:install` and `sewing-kit:install` easier installation ([840](https://github.com/Shopify/quilt/pull/840))

## [1.2.0] - 2019-08-16

### Changed

- Configuration for the address of the react server now defaults to `ENV['REACT_SERVER_IP']`:`ENV['REACT_SERVER_PORT']` if they are set.

## [1.1.0] - 2019-08-15

### Added

- Added logging for the outgoing request and response status [#853](https://github.com/Shopify/quilt/pull/853)

## [1.0.0] - 2019-08-07

### Added

- Created `quilt_rails` package
