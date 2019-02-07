# `@shopify/babel-plugin-react-i18n`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fbabel-plugin-react-i18n.svg)](https://badge.fury.io/js/%40shopify%2Fbabel-plugin-react-i18n.svg)

A babel plugin to auto-fill withI18n arguments from an adjacent translations folder

## Installation

```bash
$ yarn add @shopify/babel-plugin-react-i18n
```

## Usage

Simply add `@shopify/react-i18n` to your list of babel plugins. For example, via `.babelrc`:

```json
{
  "plugins": ["@shopify/react-i18n"]
}
```

## Example

### In

`MyComponent/MyComponent.tsx`:

```tsx
withI18n();
```

`MyComponent/translations/en.json`:

```json
{
  "key": "Translation text"
}
```

### Out

`MyComponent/MyComponent.tsx`:

```tsx
import enTranslations from './translations/en.json';

// ...

withI18n({
  id: 'MyComponent-<hash>',
  fallback: enTranslations,
  async translations(locale) {
    try {
      const dictionary = await import(/* webpackChunkName: "MyComponent-i18n" */ `./translations/${locale}.json`);
      return dictionary;
    } catch (err) {}
  },
});
```
