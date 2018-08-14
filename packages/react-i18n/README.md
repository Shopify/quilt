# `@shopify/react-i18n`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg)](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n.svg)

I18n library for React

## Installation

```bash
$ yarn add @shopify/react-i18n
```

## Usage

Set up the top-level provider & locale manager:

```javascript
import {
  Provider as I18nProvider,
  Manager as LocaleManager,
} from '@shopify/react-i18n';

export default function App() {
  const locale = 'en';
  const localeManager = new LocaleManager({locale});

  return (
    <I18nProvider manager={localeManager}>
      <NotFound />
    </I18nProvider>
  );
}
```

Usage in the localized component:

```javascript
import {withI18n, WithI18nProps} from '@shopify/react-i18n';
import * as translations from './locales';

export interface Props {}
type ComposedProps = Props & WithI18nProps;

function NotFound({i18n}: ComposedProps) {
  return (
    <EmptyState
      heading={i18n.translate('heading')}
      action={{content: i18n.translate('action'), url: '/'}}
    >
      <p>{i18n.translate('content')}</p>
    </EmptyState>
  );
}

export default withI18n({
  translations(locale) {
    return translations[locale];
  },
})(NotFound);
```

Localization files:

```javascript
// locales/index.ts

export {default as en} from './en.json';
export {default as fr} from './fr.json';
```

```json
// locales/en.json

{
  "heading": "The page you’re looking for couldn’t be found",
  "action": "Go back to Home",
  "content": "Please make sure the web address is correct."
}
```
