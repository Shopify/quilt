# `@shopify/name`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fname.svg)](https://badge.fury.io/js/%40shopify%2Fname)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/%40shopify%2Fname.svg)

Utilities for formatting localized names.

## Installation

```bash
yarn add @shopify/name
```

### formatName

Formats a name (given name and/or family name) according to the locale. For example:

- `formatName({name: {givenName: 'John', familyName: 'Smith'}, locale: 'en'})` will return `John` in English and `Smith様` in Japanese
- `formatName({name: {givenName: 'John', familyName: 'Smith'}, locale: 'en', options: {full: true}})` will return `John Smith` in English and `SmithJohn` in Japanese

### hasFamilyNameGivenNameOrdering

Returns `true` when the provided locale formats family name before given name.
For example:

- `hasFamilyNameGivenNameOrdering('ja')` will return `true`
- `hasFamilyNameGivenNameOrdering('en')` will return `false`

### abbreviateName

Takes a name (given and family name) and returns a language appropriate abbreviated name, or will return `formatName` if
it is unable to find a suitable abbreviation.

For example:

- `abbreviateName({name: {givenName: 'John', familyName: 'Smith'}, locale: 'en'})` will return `JS`
- `abbreviateName({name: {givenName: '健', familyName: '田中'}, locale: 'en'})` will return `田中`

You may also pass an optional `idealMaxLength` parameter, which gives the maximum allowable abbreviation length when
trying to abbreviate a name in the Korean language (default 3 characters). In Korean, if the given name is longer than
this length, the method will instead return the first character of the given name.

### abbreviateBusinessName

Takes a business name and returns a language appropriate abbreviated name, or will return the input name if it is unable to find
a suitable abbreviation.

For example:

- `abbreviateBusinessName({name: 'Shopify'})` will return `Sho`
- `abbreviateBusinessName({name: 'My Store'})` will return `MS`
- `abbreviateBusinessName({name: '任天堂'})` will return `任天堂`

You may also pass an optional `idealMaxLength` parameter, which gives the maximum allowable abbreviation length when
trying to abbreviate a name.
