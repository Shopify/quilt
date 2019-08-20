# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
