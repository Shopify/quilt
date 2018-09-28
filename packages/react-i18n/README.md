# `@shopify/react-i18n`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg)](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n.svg)

i18n utilities for React handling translations, formatting, and more.

## Installation

```bash
$ yarn add @shopify/react-i18n
```

## Usage

### `Provider`

This library requires a provider component which supplies i18n details to the rest of the app, and coordinates the loading of translations. Somewhere near the "top" of your application, render a `Provider` component. This component accepts a `manager` prop, which allows you to specify the locale and a few additional details, such as the default currency.

```ts
import {
  Provider as I18nProvider,
  Manager as I18nManager,
} from '@shopify/react-i18n';

const locale = 'en';
const i18nManager = new I18nManager({locale});

export default function App() {
  return (
    <I18nProvider manager={i18nManager}>{/* App contents */}</I18nProvider>
  );
}
```

### Internationalized components

Components must connect to the i18n context in order to get access to the many internationalization utilities this library provides. You can use the `withI18n` decorator to add an `i18n` prop to your component:

```ts
import * as React from 'react';
import {EmptyState} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';

export interface Props {}
type ComposedProps = Props & WithI18nProps;

function NotFound({i18n}: ComposedProps) {
  return (
    <EmptyState
      heading={i18n.translate('App.notFound')}
      action={{content: i18n.translate('App.back'), url: '/'}}
    >
      <p>{i18n.translate('App.notFoundContent')}</p>
    </EmptyState>
  );
}

export default withI18n()(NotFound);
```

#### `i18n`

The provided `i18n` object exposes many useful methods for internationalizing your apps. You can see the full details in the [`i18n` source file](https://github.com/Shopify/quilt/blob/master/packages/react-i18n/src/i18n.ts), but you will commonly need the following:

- `formatNumber()`: formats a number according to the locale. You can optionally pass an `as` option to format the number as a currency or percentage; in the case of currency, the `defaultCurrency` supplied to the i18n `Provider` component will be used where no custom currency code is passed.
- `formatDate()`: formats a date according to the locale. The `defaultTimezone` value supplied to the i18n `Provider` component will be used when no custom `timezone` is provided.

Most notably, you will frequently use `i18n`’s `translate()` method. This method looks up a key in translation files that you supply based on the provided locale. This method is discussed in detail in the next section.

#### Translations

The most commonly-used feature of the `@shopify/react-i18n` library is looking up translations. In this library, translations are provided **for the component that need them**, and are **available for ancestors of the component**. This allows applications to grow while keeping translations manageable, makes it clearer where to add new translations, and follows Shopify’s principle of [isolation over integration](https://github.com/Shopify/web-foundation/blob/master/Principles/4%20-%20Isolation%20over%20integration.md) by collocating translations with all other component assets.

Translations are provided using two keys in the `withI18n` decorator:

- `fallback`: a translation file to use when translation keys are not found in the locale-specific translation files. These will usually be your English translations, as they are typically the most complete.
- `translations`: a function which takes the locale and returns one of: nothing (no translations for the locale), a dictionary of key-value translation pairs, or a promise of one of the above. Alternatively, you can pass an object where the keys are locales, and the values are either translation dictionaries, or promises for translation dictionaries.

If you provide any of the above options, you must also provide an `id` key, which gives the library a way to store the translation dictionary.

Here’s the example above with component-specific translations:

```ts
import * as React from 'react';
import {EmptyState} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';

import en from './locales/en.json';
import fr from './locales/fr.json';

export interface Props {}
type ComposedProps = Props & WithI18nProps;

function NotFound({i18n}: ComposedProps) {
  return (
    <EmptyState
      heading={i18n.translate('NotFound.heading')}
      action={{content: i18n.translate('NotFound.action'), url: '/'}}
    >
      <p>{i18n.translate('NotFound.content')}</p>
    </EmptyState>
  );
}

export default withI18n({
  id: 'NotFound',
  fallback: en,
  translations(locale) {
    if (locale === 'en') {
      return en;
    } else if (locale === 'fr') {
      return fr;
    }
  },
})(NotFound);
```

```json
// NotFound/components/en.json
{
  "NotFound": {
    "heading": "Page not found",
    "action": "Back",
    "content": "The page you were looking for could not be found. Please check the web address for errors and try again."
  }
}
```

As shown above, we recommend scoping the translation file to the name of the component to prevent potential naming conflicts resulting from typos in the keys you use.

A few other details are worth noting about translation loading and lookup:

- Your `translations` function can be called several times for a given locale. If, for example, the locale is `en-CA`, your function will be called with `en-CA` and `en`, which allows you to load country-specific variations for translations.
- The `i18n` object supplied to a given component can reference translations at any level of depth using a keypath (for example, `NotFound.heading` in the code above). It can also reference translations in parent components; use this to include common translations around a component that contains most of your application.
- When `translate` is called, it looks up translations in the following order: explicit translations provided by the component’s `translations` function, then translations from the `fallback` for the component, then the same process in every parent component, from bottom to top, that are also connected with `i18n`.
- In the case of asynchronous translations, your component will only be able to look up translations from its (and ancestors’) `fallback` translation dictionaries until the translations have loaded.

##### Replacements

Replacements can be provided as key-value pairs following the translation key. Your translations should reference the relevant key names, surrounded by a single set of curly braces:

```ts
// Assuming a dictionary like:
// {
//   "MyComponent": {
//     "details": "See {link}"
//   }
// }

i18n.translate('MyComponent.details', {link: <Link />});
```

Replacements can by plain strings or React elements. When a React element is found, the resulting value will be a `ReactNode`, which can be used as the children of other React components.

##### Dynamic translation keys

For dynamically-generated translation keys, you can use the `scope` option to specify a partial keypath against which the key is looked up:

```ts
// Assuming a dictionary like:
// {
//   "MyComponent": {
//     "option": {
//       "valueOne": "One",
//       "valueTwo": "Two"
//     }
//   }
// }

i18n.translate(key, {scope: 'MyComponent.option'});

// or

i18n.translate(key, {scope: ['MyComponent', 'option']});
```

##### Pluralization

`@shopify/react-i18n` handles pluralization similarly to [Rails’ default i18n utility](https://guides.rubyonrails.org/i18n.html#pluralization). The key is to provide the plural-dependent value as a `count` variable. `react-i18n` then looks up the plural form using [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules) and, within the keypath you have specified for the translation, will look up a nested translation matching the plural form:

```ts
// Assuming a dictionary like:
{
  "MyComponent": {
    "searchResult": {
      "one": "One widget found",
      "other": "{count} widgets found"
    }
  }
}

i18n.translate('MyComponent.searchResult', {count: searchResults});
```

As noted above, this functionality depends on the `Intl.PluralRules` global. If this does not exist [for your environment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules#Browser_compatibility), we recommend including the [`intl-pluralrules`](https://yarnpkg.com/en/package/intl-pluralrules) polyfill.

### Server

When rendering internationalized React apps on the server, you may wish to extract the translations and rehydrate them on the client. This is primarily needed when translations are loaded asyncronously; not doing so would cause the server and client markup to differ. You can use the `getTranslationsFromTree` function from this package to wait for all translations to load:

```ts
const element = <App />;
const translations = await getTranslationsFromTree(element);
```

Once you have done this, serialize the result (we recommend [`@shopify/react-serialize`](https://github.com/Shopify/quilt/tree/master/packages/react-serialize)), then load it on the client and include it as part of the initialization of the i18n manager:

```ts
import {
  Provider as I18nProvider,
  Manager as I18nManager,
} from '@shopify/react-i18n';
import {getSerialized} from '@shopify/react-serialize';

const locale = 'en';
const {data: translations} = getSerialized('translations');
const i18nManager = new I18nManager({locale}, translations);

export default function App() {
  return (
    <I18nProvider manager={i18nManager}>{/* App contents */}</I18nProvider>
  );
}
```

## FAQ

### Why another i18n library? Why not just use <[react-intl](https://github.com/yahoo/react-intl) | [react-i18next](https://github.com/i18next/react-i18next)> etc?

These libraries are excellent, and we may well use parts of them under the hood for this project. However, we wanted to add a Shopify-specific layer that cleanly exposes some features we feel are non-negotiable:

- Per-component management of translations, to avoid the ever-growing translation files that hurt our largest apps.
- Asynchronous loading of translation files, so that we can scale the number of supported languages without increasing bundle sizes.
- An API for translations that feels consistent with Rails’ default i18n utilities.
- Exposing currency and datetime formatting utilities that automatically follow the [Polaris conventions](https://polaris.shopify.com/content/grammar-and-mechanics#section-dates-numbers-and-addresses).

Additional details on why we built our own package, and on specifics of parts of this package’s API, are available in the [original proposal](https://github.com/Shopify/web-foundation/pull/3).
