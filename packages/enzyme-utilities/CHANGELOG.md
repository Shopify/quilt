# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

<!-- Unreleased changes should go to UNRELEASED.md -->

---

## Unreleased

## 2.0.0 - 2019-03-28

### Changed

- `trigger` now runs the callback in a `react-dom` `act()` block, which prevents React warnings for synchronous updates resulting from calling a prop. This change means that the library now only supports React versions >=16.8 [[#612](https://github.com/Shopify/quilt/pull/612)]
