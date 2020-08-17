# `@shopify/network`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fnetwork.svg)](https://badge.fury.io/js/%40shopify%2Fnetwork.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/network.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/network.svg)

Common values related to dealing with the network.

## Installation

```bash
$ yarn add @shopify/network
```

## Usage

Import any of the enums or functions in this package to get a friendly API to common network details. The following values are exposed from this library:

- `Method`: enum for HTTP methods
- `StatusCode`: enum for HTTP status codes (mapping from name to number)
- `ResponseType`: response type enum (2xx, 3xx, etc)
- `Header`: enum for common header names
- `CspDirective`: enum for names of [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) directives
- `CspSandboxAllow`: enum for values allowed in the [CSP `sandbox`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox) directive
- `SpecialSource`: enum for "special" (non-URI) sources usable in many CSP directives
- `nonceSource()`: function for generating nonce sources in CSP directives
- `getResponseType`: returns the `ResponseType` for an HTTP status code
- `HashAlgorithm`: enum for hash algorithms usable in several CSP directives
- `hashSource()`: function for generating hash sources in CSP directives
