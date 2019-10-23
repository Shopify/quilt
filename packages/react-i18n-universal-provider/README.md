# `@shopify/react-i18n-universal-provider`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-i18n-universal-provider.svg)](https://badge.fury.io/js/%40shopify%2Freact-i18n-universal-provider.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n-universal-provider.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n-universal-provider.svg)

A self-serializing/deserializing i18n provider that works for isomorphic applications.

## Installation

```bash
$ yarn add @shopify/react-i18n-universal-provider
```

## Usage

#### Props

The component takes an object containing the React children to render and any options to use when configuring the `I18nManager` to provide to the tree.

#### Example

```tsx
// App.tsx
import {I18nUniversalProvider} from '@shopify/react-i18n-universal-provider';

function App({locale}: {locale?: string}) {
  return <I18nUniversalProvider locale={locale}>{/* rest of the app */}</I18n>;
}
```
