# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.1.0] 2019-10-25

### Added

- `clientMetricsMiddleware` no longer requires `development?` to be explicitly set in it's `options` parameter. If the parameter is missing it will default to `true` when `process.env.NODE_ENV` is `true`, and `false` otherwise.

## [1.0.0] 2019-10-08

### Added

- `@shopify/koa-performance` package [#1095](https://github.com/Shopify/quilt/pull/1095)
