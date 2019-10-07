# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

<!-- Unreleased changes should go to UNRELEASED.md -->

---

<!-- ## [Unreleased] -->

## 0.3.0 - 2019-10-07

- Use `@shopify/statd` instead of Metrics implementation. The log using logger in distribution was removed. ([#1074](https://github.com/Shopify/quilt/pull/1074))

## 0.2.0 - 2019-04-12

- Wrapping all the calls in a Promise and awaiting them at the end of the middleware.
- Remove .measure because it wasn't used anymore.
- Update hot-shots to support optional arguments for .distribution.
  ([#640](https://github.com/Shopify/quilt/pull/640))

## 0.1.12 - 2019-01-09

- Start of Changelog
