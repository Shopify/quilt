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

The `<I18nUniversalProvider>` takes the following props:

```tsx
// from @shopify/react-i18n
I18nDetails {
    locale: string;
    country?: string;
    currency?: string;
    timezone?: string;
    pseudolocalize?: boolean;
    fallbackLocale?: string;
    onError?(error: I18nError): void;
}
```

#### Example

```tsx
// App.tsx
import {I18nUniversalProvider} from '@shopify/react-i18n-universal-provider';

function App({locale}: {locale?: string}) {
  return (
    <I18nUniversalProvider locale={locale}>
      {/* rest of the app */}
    </I18nUniversalProvider>
  );
}
```

### Possible Issues

#### Missing i18n manager error

```
Error: Missing i18n manager. Make sure to use an <I18nContext.Provider /> somewhere in your React tree from the @shopify/react-i18n hook.
```

###### Cause:

Duplicate and/or unmet versions of `react-i18n`

###### Potential Solution:

Deduplicating dependencies for react-i18n-universal-provider and react-i18n.

```bash
$ npx yarn-deduplicate --packages @shopify/react-i18n yarn.lock
npx yarn-deduplicate --packages @shopify/react-html yarn.lock
npx yarn-deduplicate --packages @shopify/react-effect yarn.lock
# deduplicate other dependencies of @shopify/react-i18n
```

```bash
$ yarn why @shopify/react-i18n # ensure no duplicate / unmet dependencies
yarn list  # ensure no duplicate / unmet dependencies
yarn install
```
