# `@shopify/csrf-token-fetcher`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher.svg)](https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/csrf-token-fetcher.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/csrf-token-fetcher.svg)

JavaScript utility function to fetch the CSRF token required to make requests to a Rails server.

## Installation

```bash
$ yarn add @shopify/csrf-token-fetcher
```

## API Reference

### `function getCSRFToken(scope = document)`

Retrieve the CSRF token from the meta tag rendered by a Rails server. This token is required in the `X-CSRF-Token` header for requests to the Rails server.

In the `html.erb` file:

```
<%= csrf_meta_tags %>
```

#### Example Usage

```typescript
import getCSRFToken from '@shopify/csrf-token-fetcher';

getCSRFToken();
// → 'token_value'
```
