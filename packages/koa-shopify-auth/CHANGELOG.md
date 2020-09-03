# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [3.1.68] - 2020-08-26

- Wrap `encodeURI` values in double quotes [1613](https://github.com/Shopify/quilt/pull/1613)

## [3.1.67] - 2020-08-26

- URI encode `config` on redirection page [1612](https://github.com/Shopify/quilt/pull/1612)

## [3.1.65] - 2020-07-06

- Include `prefix` when redirect to the root endpoint [1498](https://github.com/Shopify/quilt/pull/1498)

## [3.1.63] - 2020-05-25

### Fixed

- Protect against reflected XSS vulnerability [1455](https://github.com/Shopify/quilt/pull/1455)

## [3.1.62] - 2015-05-20

### Fixed

- Include `prefix` when we redirect to the `/auth` path.

## [3.1.61] - 2020-05-01

- Fixes ITP 2.3 and Safari 13.1 enable cookies loop [1413](https://github.com/Shopify/quilt/pull/1413)

## [3.1.56] - 2020-02-03

- Package now forces cookies.secure to be true [1255](https://github.com/Shopify/quilt/pull/1255)
- Package sets cookies to samesite:none and secure [1251](https://github.com/Shopify/quilt/pull/1251)

## [3.1.54] - 2020-01-24

- Updated redirect script to use App Bridge [1242](https://github.com/Shopify/quilt/pull/1242)

## [3.1.37] - 2019-09-23

### Fixed

- No longer errors out on fresh installs with no session [1022](https://github.com/Shopify/quilt/pull/1022)

## [3.1.36] - 2019-08-30

### Fixed

- Package no longer allows sessions from one shop to bleed over into another [940](https://github.com/Shopify/quilt/pull/940)

## [3.1.32] - 2019-08-15

### Fixed

- Package now lists missing '@shopify/network' dependency [862](https://github.com/Shopify/quilt/pull/862)

## [3.1.31] - 2019-08-13

### Fixed

- Installation no longer fails if accessToken is invalid [#844](https://github.com/Shopify/quilt/pull/844)

## [3.1.14] - 2019-02-05

### Fixed

- OAuth route no longer rejects uppercase shop domains [#493](https://github.com/Shopify/quilt/pull/493)

## [3.1.11] - 2019-01-10

### Fixed

- HMAC validation no longer breaks when params are unsorted [#451](https://github.com/Shopify/quilt/pull/451)

## [3.1.10] - 2019-01-09

- Start of Changelog
