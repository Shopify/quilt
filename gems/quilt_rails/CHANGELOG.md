# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

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
