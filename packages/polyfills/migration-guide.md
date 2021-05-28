# Migration guide

This is a concise summary of changes and recommendations around updating `@shopify/polyfills` in consuming projects. For a more detailed list of changes, see [the changelog](./CHANGELOG.md).

## [Unreleased]

Base polyfills now use `core-js@3`. The following polyfills have been removed because they are provided by `core-js@3`. Please remove imports containing:

- `@shopify/polyfill/url`
- `@shopify/polyfill/unhandled-rejection`

## [2.0.0] - 2021-05-21

Node support less than version `12.14.0` has been removed.

## [1.0.0] - 2021-05-19

✅ No action required.
