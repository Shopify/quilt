# `@shopify/phone`

> [!CAUTION]
>
> `@shopify/phone` is deprecated.
>
> Shopifolk, see
> [Shopify/quilt-internal](https://github.com/shopify/quilt-internal) for
> information on the latest packages available for use internally.

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fphone.svg)](https://badge.fury.io/js/%40shopify%2Fphone.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/phone.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/phone.svg)

Phone number utilities for formatting phone numbers.

## Installation

```bash
yarn add @shopify/phone
```

## PhoneNumberFormatter methods

```ts
import PhoneNumberFormatter from '@shopify/phone';

// Pass a region code to the constructor
const phoneFormatter = new PhoneNumberFormatter('US');
const formatted = phoneFormatter.format(myPhoneNumber);
```

#### `format(phoneNumber: string): string`

Formats the given phone number

#### `update(regionCode: string): void`

Update formatter regionCode which will format number based on that (eg: 'CA' | 'JP' etc.)

#### `getNormalizedNumber(phoneNumber: string): string`

Returns phone number in E164 format

#### `getNationalNumber(phoneNumber: string): string`

Returns the non-formatted version without the country code

#### `requiresItalianLeadingZero(phoneNumber: string)`

Indicates if the leading zero of a national number should be retained when dialling internationally

#### `updateCountryCode(phoneNumber: string): void`

Updates the country code of the formatter based on the phoneNumber passed

## Exported functions

### `getRegionCodeFromNumber(phoneNumber: string): string`

Returns the region code from the provided phone number

### `getCountryCodeFromNumber(phoneNumber: string): number | undefined`

Returns the country code from the provided phone number
