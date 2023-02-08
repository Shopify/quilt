# `@shopify/i18n`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fi18n.svg)](https://badge.fury.io/js/%40shopify%2Fi18n.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/i18n.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/i18n.svg)

Generic i18n-related utilities and simple translate implementation.

## Installation

```bash
yarn add @shopify/i18n
```

## Usage

### `SimpleI18n`

Objec that provides an extremely simplified translate function that can be used without React integration.

- supports plurals and ordinals
- allows replacements using `{}` syntax
- translations must be passed in by user
- multiple translation libraries may be provided and are assumed to be in 'primary locale -> fallback locale' order

This is mean to provide a simple straightforward TypeScript only translation solution that aligns with Shopify's i18n practicies and is unlikely to be suitable for more complex requirements or large apps.

##### Initialization

```ts
const i18n = new SimpleI18n([{hello: 'Hello, {name}!'}], 'en');
```

##### Translation

```ts
simpleI18n.translate('hello', {bar: 'World'});
```

- translation keys may be nested
- translations should follow the [schema outlined in React-I18n](https://github.com/Shopify/quilt/blob/main/packages/react-i18n/docs/react_i18n_schema.md)
- this simplified translate function accepts the translation key and optional replacements as arguments
- please refer to [React-I18n's caveats](https://github.com/Shopify/quilt/tree/main/packages/react-i18n#intlpluralrules) regarding `Intl.PluralRules`
- you can use `translationKeyExists(key)` to check if a given key exists

### `pseudotranslate()`

Takes a string and returns a version of it that appears as if it were translated (learn more about [pseudotranslation](https://help.smartling.com/hc/en-us/articles/360000307573-Testing-with-Pseudo-Translation)).

This function accepts a number of arguments to customize the translation:

- `toLocale`: a locale to simulate translation for. This is used primarily to adjust the change in size relative to the original string. When not provided, or when a locale is provided for which no custom size ratio exists, this function slightly increases the string size.
- `delimiter`, `startDelimiter`, `endDelimiter`: strings used to mark parts of the source string that should not be translated. This can be used, for example, to prevent translation of replacements within a string.
- `prepend` and `append`: strings to put at the start and end of the resulting string, respectively. This can be used to provide a common set of text around pseudotranslated code that can identify translated strings that are incorrectly joined together.

```ts
import {pseudotranslate} from '@shopify/i18n';

const pseudoOne = pseudoTranslate('cat'); // something like 'ͼααṭ'
const pseudoTwo = pseudoTranslate('cats: {names}', {
  toLocale: 'de',
  startDelimiter: '{',
  endDelimiter: '}',
  prepend: '[[!',
  append: '!]]',
}); // something like '[[!ͼααṭṡṡ: {names}]]!'
```

### `regionFromLocale()`

Accepts a locale and extracts the country code as defined in [BCP 47](https://tools.ietf.org/html/rfc5646#section-2.2.4), if it exists. The country code will be normalized to fully uppercase when present.

```ts
import {regionFromLocale} from '@shopify/i18n';

const regionEn = regionFromLocale('en'); // undefined
const regionEnCa = regionFromLocale('en-ca'); // 'CA'
```

### `languageFromLocale()`

Accepts a locale and extracts the language subtag as defined in [BCP 47](https://tools.ietf.org/html/rfc5646#section-2.2.1).

```ts
import {languageFromLocale} from '@shopify/i18n';

const languageFrCa = languageFromLocale('fr-CA'); // 'fr'
```
