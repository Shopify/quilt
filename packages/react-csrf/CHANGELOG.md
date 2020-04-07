# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Changed context type to take { csrfToken: string | undefined; } to work properly with newest serialize-javascript version 3.0.0 and JSON.parse enforcement

## [1.0.8] - 2020-10-15

### Changed

- Changed type from `string | null` to `string | undefined` [[#1120](https://github.com/Shopify/quilt/pull/1120)]

## [1.0.0] - 2019-08-28

### Added

- `@shopify/react-csrf` package [[#918](https://github.com/Shopify/quilt/pull/918)]
