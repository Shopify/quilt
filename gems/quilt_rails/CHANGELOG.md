# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Refactor generators into smaller tasks.
  Added the generation of a few more configuration files `.editorconfig`, `.eslintignore`, `.prettierignore`
  Added a default `package.json` file
  Added the ability to grab application name from Rails setting for `package.json` & `sewing-kit.config`
  Lock the version of `react`, `react-dom` and `typescript`
  ([#1449](https://github.com/Shopify/quilt/pull/1449))

## [1.12.2] - 2020-05-19

- Fixed: Performance endpoint now parses `text/plain` report data as JSON

## [1.12.1] - 2020-05-14

- Fixed: Performance endpoint now accepts data that lacks a `connection` parameter, replacing it with a stand-in value

## [1.12.0] - 2020-05-07

- Add: Expose a `data` argument on `render_react` to share data to the React server using the `X-Quilt-Data` header ([#1411](https://github.com/Shopify/quilt/pull/1411))

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
