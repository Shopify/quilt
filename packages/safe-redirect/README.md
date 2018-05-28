# `@shopify/safe-redirect`

[![CircleCI](https://circleci.com/gh/Shopify/quilt.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fsafe-redirect.svg)](https://badge.fury.io/js/%40shopify%2Fsafe-redirect.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/safe-redirect.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/safe-redirect.svg)

A Node implementation of [safe_redirect](https://github.com/Shopify/safe_redirect). Provides utilities for validating and sanitizing URLs for the purposes of redirection. You can validate the URLs using any set of the following options:

* `whitelist`: an array of hosts to allow (will mark relative URLs as invalid)
* `subdomains`: an array of subdomains to allow (can be used with `whitelist`; will mark relative URLs as invalid)
* `matchPath`: a string or regular expression to compare the URL’s path against
* `requireAbsolute`: whether or not to require absolute paths (defaults to `false`)
* `requireSSL`: whether or not to require `https:` (will mark relative URLs as invalid; defaults to `false`)

The following utilities are provided by this package, and each take the options listed above:

```ts
export function isSafe(url: string, options?: Options): boolean;
export function makeSafe(
  url: string,
  fallback: string,
  options?: Options,
): string;
```

Note that this library requires `URL` to be globally accessible. On a Node server, this can be done by assigning `global.URL = require('url').URL`, which is often necessary for isomorphic JavaScript apps anyways.

## Installation

```bash
$ yarn add @shopify/safe-redirect
```

## Usage
