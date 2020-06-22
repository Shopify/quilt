# `@shopify/address-mocks`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Faddress-mocks.svg)](https://badge.fury.io/js/%40shopify%2Faddress-mocks)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/%40shopify/shopify%2address-mocks.svg)

Address mocks for `@shopify/address`.

## Installation

```bash
$ yarn add @shopify/address-mocks
```

## Testing

If your component uses the @shopify/address package and you want to mock API calls, you can use the following:

```
import {fetch} from '@shopify/jest-dom-mocks';
import {mockCountryRequests} from '@shopify/address-mocks';

beforeEach(mockCountryRequests);
afterEach(fetch.restore);
```

Note: Only FR / JA and EN are mocked.
