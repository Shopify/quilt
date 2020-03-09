# Unreleased

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- Released changes should go to CHANGELOG.md -->

---

- [patch] add clearer type check in loadCountry and loadCountries function. The
  need to add the check was to fix yarn build because `@shopify/address-consts`
  was updated, although the version was not bumped on `@shopify/address`.
  [#1313](https://github.com/Shopify/quilt/pull/1313)
