# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Changed context type to take { csrfToken: string | undefined; } to work properly with newest serialize-javascript version 3.0.0 and JSON.parse enforcement

## [1.1.0] - 2019-12-19

### Changed

- Changed type definition from `string` to `string | undefined`

## [1.0.0] - 2019-08-28

### Added

- `@shopify/react-csrf-universal-provider` package
