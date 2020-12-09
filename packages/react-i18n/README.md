# `@shopify/react-i18n`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg)](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-i18n.svg)

i18n utilities for React handling translations, formatting, and more.

## Installation

```bash
$ yarn add @shopify/react-i18n
```

## Usage

### `<I18nContext.Provider />` and `I18nManager`

This library requires a provider component which supplies i18n details to the rest of the app, and coordinates the loading of translations. Somewhere near the "top" of your application, render a `I18nContext.Provider` component. This component accepts an `I18nManager` as the `value` prop, which allows you to specify the following global i18n properties:

- `locale`: the current locale of the app. This is the only required option.
- `fallbackLocale`: the locale that your component’s will use in any of their fallback translations. This is used to avoid unnecessarily serializing fallback translations.
- `country`: the default country to use for country-aware formatting.
- `timezone`: the default timezone to use for timezone-aware formatting.
- `currency`: the default currency to use for currency-aware formatting.
- `pseudolocalize`: whether to perform [pseudolocalization](https://github.com/Shopify/pseudolocalization) on your translations.
- `onError`: a callback to use when recoverable i18n-related errors happen. If not provided, these errors will be re-thrown wherever they occur. If it is provided and it does not re-throw the passed error, the translation or formatting that caused the error will return an empty string. This function will be called with the error object.

```tsx
import {I18nContext, I18nManager} from '@shopify/react-i18n';

const locale = 'en';
const i18nManager = new I18nManager({
  locale,
  onError(error) {
    Bugsnag.notify(error);
  },
});

export default function App() {
  return (
    <I18nContext.Provider value={i18nManager}>
      {/* App contents */}
    </I18nContext.Provider>
  );
}
```

### Internationalized components

Components must connect to the i18n context in order to get access to the many internationalization utilities this library provides. You can use the `useI18n` hook to access `i18n` in your component:

```tsx
import React from 'react';
import {EmptyState} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';

export default function NotFound() {
  const [i18n] = useI18n();
  return (
    <EmptyState
      heading={i18n.translate('NotFound.heading')}
      action={{content: i18n.translate('Common.back'), url: '/'}}
    >
      <p>{i18n.translate('NotFound.content')}</p>
    </EmptyState>
  );
}
```

The hook also returns a `ShareTranslations` component. You can wrap this around a part of the subtree that should have access to this component’s translations.

> **Note:** `ShareTranslations` is not guaranteed to re-render when your i18n object changes. If you render `ShareTranslations` inside of a component that might block changes to children, you will likely run into issues. To prevent this, we recommend that `ShareTranslations` should be rendered as a top-level child of the component that uses `useI18n`.

```tsx
import React from 'react';
import {Page} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';

interface Props {
  children: React.ReactNode;
}

export default function ProductDetails({children}: Props) {
  const [i18n, ShareTranslations] = useI18n();
  return (
    <ShareTranslations>
      <Page title={i18n.translate('ProductDetails.title')}>{children}</Page>
    </ShareTranslations>
  );
}
```

`@shopify/react-i18n` also provides the `withI18n` decorator as a migration path towards the `useI18n` hook, or for use with class components. Unlike the hook version, components using the `withI18n` decorator always share their translations with the entire tree.

```tsx
import React from 'react';
import {EmptyState} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';

export interface Props {}
type ComposedProps = Props & WithI18nProps;

class NotFound extends React.Component<ComposedProps> {
  render() {
    const {i18n} = this.props;

    return (
      <EmptyState
        heading={i18n.translate('NotFound.heading')}
        action={{content: i18n.translate('Common.back'), url: '/'}}
      >
        <p>{i18n.translate('NotFound.content')}</p>
      </EmptyState>
    );
  }
}

export default withI18n()(NotFound);
```

#### `i18n`

The provided `i18n` object exposes many useful methods for internationalizing your apps. You can see the full details in the [`i18n` source file](https://github.com/Shopify/quilt/blob/master/packages/react-i18n/src/i18n.ts), but you will commonly need the following:

- `formatNumber()`: formats a number according to the locale. You can optionally pass an `as` option to format the number as a currency or percentage; in the case of currency, the `defaultCurrency` supplied to the i18n `I18nContext.Provider` component will be used where no custom currency code is passed.
- `formatCurrency()`: formats a number as a currency according to the locale. Its behaviour depends on the `form:` option.
  - if `form: 'short'` is given, then a possibly-ambiguous short form is used, consisting of the bare symbol if the currency has a symbol, or the ISO 4217 code if there is no symbol for that currency. Examples: `CHF 1,25`, `€ 1,25 EUR`, `OMR 1.250`, `$ 1.25 USD`
  - if `form: 'explicit'` is given, then the result will be the same as for `short`, but will append the ISO 4217 code if it is not already present
  - if `form: 'auto'` is given, then `explicit` will be selected if the `currency` option does not match the `defaultCurrency`, otherwise `short` is selected. If either `currency` or `defaultCurrency` is not defined then `short` is selected.
  - if `form:` is not given, then behaviour reverts to the legacy (deprecated) `formatCurrency()`, which is a convenience function that simply _auto-assigns_ the `as` option to `currency` and calls `formatNumber()`. Note that this will resemble `form: 'short'`, but will sometimes extend the symbol with extra information depending on the browser's implementation of `Intl.NumberFormat` and the locale in use. For example, `formatCurrency(1.25, {currency: 'CAD'})` may return `$ 1.25`, or it might return `CA$ 1.25`.
- `formatPercentage()`: formats a number as a percentage according to the locale. Convenience function that simply _auto-assigns_ the `as` option to `percent` and calls `formatNumber()`.
- `formatDate()`: formats a date according to the locale. The `defaultTimezone` value supplied to the i18n `I18nContext.Provider` component will be used when no custom `timezone` is provided. Assign the `style` option to a `DateStyle` value to use common formatting options.
  - `DateStyle.Long`: e.g., `Thursday, December 20, 2012`
  - `DateStyle.Short`: e.g., `Dec 20, 2012`
  - `DateStyle.Humanize`: Adheres to [Polaris guidelines for dates with times](https://polaris.shopify.com/content/grammar-and-mechanics#section-dates-numbers-and-addresses), e.g., `Just now`, `3 minutes ago`, `4 hours ago`, `10:35 am`, `Yesterday at 10:35 am`, `Friday at 10:35 am`, or `Dec 20 at 10:35 am`, or `Dec 20, 2012`
  - `DateStyle.Time`: e.g., `11:00 AM`
- `weekStartDay()`: returns start day of the week according to the country.
- `getCurrencySymbol()`: returns the currency symbol according to the currency code and locale.
- `formatName()`: formats a name (first name and/or last name) according to the locale. e,g
  - `formatName('John', 'Smith')` will return `John` in Germany and `Smith様` in Japan
  - `formatName('John', 'Smith', {full: true})` will return `John Smith` in Germany and `SmithJohn` in Japan
- `ordinal()`: formats a number as an ordinal according to the locale, e.g. `1st`, `2nd`, `3rd`, `4th`
- `hasEasternNameOrderFormatter()`: returns true when an eastern name order formatter corresponding to the locale/language exists.

Most notably, you will frequently use `i18n`’s `translate()` method. This method looks up a key in translation files that you supply based on the provided locale. This method is discussed in detail in the next section.

#### Translations

The most commonly-used feature of the `@shopify/react-i18n` library is looking up translations. In this library, translations are provided **for the component that need them**, and are **available for ancestors of the component**. This allows applications to grow while keeping translations manageable, makes it clearer where to add new translations, and follows Shopify’s principle of [isolation over integration](https://github.com/Shopify/web-foundations/blob/main/handbook/Principles/4%20-%20Isolation%20over%20integration.md) by collocating translations with all other component assets.

Translations are serialized into files according to [the React I18n schema](./docs/react_i18n_schema.md).

Translations are provided using two keys in the `withI18n` decorator:

- `fallback`: a translation file to use when translation keys are not found in the locale-specific translation files. These will usually be your English translations, as they are typically the most complete.
- `translations`: a function which takes the locale and returns one of: nothing (no translations for the locale), a dictionary of key-value translation pairs, or a promise of one of the above. The `translations` function can also throw and `react-i18n` will handle the situation gracefully. Alternatively, you can pass an object where the keys are locales, and the values are either translation dictionaries, or promises for translation dictionaries.

We recommend that you co-locate your translation files in a `./translations` directory and that you include an `en.json` file ([schema specification](docs/react_i18n_schema.md)) in that directory as your fallback. We give preferential treatment to this structure via a [babel plugin](#Babel) that will automatically fill in the arguments to `useI18n`/ `withI18n` for you.

If you provide any of the above options, you must also provide an `id` key, which gives the library a way to store the translation dictionary. If you're using the [babel plugin](#Babel), this `id` will the automatically generated based on the relative path to your component from your project's root directory.

Here’s the example above with component-specific translations:

```tsx
import React from 'react';
import {EmptyState} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';

import en from './translations/en.json';
import fr from './translations/fr.json';

export default function NotFound() {
  const [i18n] = useI18n({
    id: 'NotFound',
    fallback: en,
    translations(locale) {
      if (locale === 'en') {
        return en;
      } else if (locale === 'fr') {
        return fr;
      }
    },
  });

  return (
    <EmptyState
      heading={i18n.translate('NotFound.heading')}
      action={{content: i18n.translate('NotFound.action'), url: '/'}}
    >
      <p>{i18n.translate('NotFound.content')}</p>
    </EmptyState>
  );
}
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

It may be necessary to check dynamic keys. You can use the `translationKeyExists` method to do so:

```ts
const keyExists = i18n.translationKeyExists(key);

if (keyExists) {
  return i18n.translate(key, {scope: ['MyComponent', 'option']});
}
```

##### Pluralization

`@shopify/react-i18n` handles pluralization similarly to [Rails’ default i18n utility](https://guides.rubyonrails.org/i18n.html#pluralization) ([with some minor differences](docs/react_i18n_schema.md#pluralization-1)). The key is to provide the plural-dependent value as a `count` variable. `react-i18n` then looks up the plural form using [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules) and, within the keypath you have specified for the translation, will look up a nested translation matching the plural form:

```ts
// Assuming a dictionary like:
{
  "MyComponent": {
    "searchResult": {
      "one": "{count} widget found",
      "other": "{count} widgets found"
    }
  }
}

i18n.translate('MyComponent.searchResult', {count: searchResults});
```

As noted above, this functionality depends on the `Intl.PluralRules` global. If this does not exist [for your environment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules#Browser_compatibility), we recommend including the [`intl-pluralrules`](https://yarnpkg.com/en/package/intl-pluralrules) polyfill or included `import '@shopify/polyfills/intl';` from [`@shopify/polyfills`](https://github.com/Shopify/quilt/tree/master/packages/polyfills).
We also recommend to have the `{count}` variable in all of your keys as some languages can use the key `"one"` when the count is `zero` for example. See MDN docs on [Localization and Plurals](https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals).

By default, `{count}` will be automatically formatted as a number. If you want to format the variable differently, you can simply pass it in another variable.

```ts
// Assuming a dictionary like:
{
  "MyComponent": {
    "searchResult": {
      "one": "{formattedCount} widget found",
      "other": "{formattedCount} widgets found"
    }
  }
}

i18n.translate('MyComponent.searchResult', {
  count: searchResults,
  formattedCount: i18n.formatNumber(searchResults),
});
```

##### Translation tree

If you need to access the subtree of your translations, you can use `i18n.getTranslationTree` to get all subtranslations:

```ts
// Assuming a dictionary like:
{
  "MyComponent": {
    "countries": {
      "CA": "Canada",
      "FR": "France",
      "JP": "Japan"
    }
  }
}

i18n.getTranslationTree('MyComponent.countries');
// Will return
// {
//   "CA": "Canada",
//   "FR": "France",
//   "JP": "Japan"
// }
```

### Server

When rendering internationalized React apps on the server, you will want to extract the translations and rehydrate them on the client if any translations are loaded asynchronously. Not doing so would cause the server and client markup to differ, resulting in a full re-render.

We recommend you to use [`@shopify/react-html`](https://github.com/Shopify/quilt/tree/master/packages/react-html) with [`@shopify/react-i18n-universal-provider`](https://github.com/Shopify/quilt/tree/master/packages/react-i18n-universal-provider) to serialize the extracted translations and rehydrate them on the client.

```tsx
import {
  Html,
  render,
  Serialize,
  HtmlContext,
  HtmlManager,
} from '@shopify/react-html/server';
import {I18nManager} from '@shopify/react-i18n';
import {extract} from '@shopify/react-effect/server';


function App({locale}: {locale?: string}) {
  return (
    <I18nUniversalProvider locale={locale}>
      {/* App contents */}
    </I18nContext.Provider>
  );
}
const app = <App locale='en' />;

const htmlManager = new HtmlManager();
await extract(element, {
  decorate(app) {
    return (
      <HtmlContext.Provider value={htmlManager}>{app}</HtmlContext.Provider>
    );
  },
});

const html = render(
  <Html manager={htmlManager}>
    {app}
  </Html>,
);
```

### Babel

This package includes a plugin for Babel that auto-fills `useI18n`'s or `withI18n`'s arguments from an adjacent translations folder. The Babel plugin is exported from the `@shopify/react-i18n/babel` entrypoint:

```js
// babel.config.js
{
  plugins: [
    ['@shopify/react-i18n/babel'],
  ],
}
```

This plugin will look for an adjacent translations folder containing, at minimum, an `en.json` file (the default locale). It will then iterate over each reference to the `useI18n` hook or `withI18n` decorator and, if the reference is a call expression with no arguments, and inject the appropriate arguments.

```js
// Within MyComponent.tsx:

useI18n();

// Becomes:

import _en from './translations/en.json';

useI18n({
  id: 'MyComponent_<hash>',
  fallback: _en,
  async translations(locale) {
    const dictionary = await import(
      /* webpackChunkName: "MyComponent_<hash>-i18n", webpackMode: "lazy-once" */ `./translations/${locale}.json`
    );
    return dictionary;
  },
});
```

#### Integration with babel-loader

Because `babel-loader`'s cache is based on a component's source content hash, newly added translation files will not invalidate the component's Babel cache. To combat this, run the `generateTranslationIndexes` function before building, and configure the plugin to use its `from-generated-index` mode.

The generator will look for any `translations` folders and generate an array of local ids in `translations/index.js` based on the `{locale}.json` files found. We recommend that you add `**/translations/index.js` to `.gitignore` to make sure the generated files are not checked-in.

```js
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                ['@shopify/react-i18n/babel', {mode: 'from-generated-index'}],
              ],
            },
          },
        ],
      },
    ],
  },
};
```

```js
// generate-translations.js
const {
  generateTranslationIndexes,
} = require('@shopify/react-i18n/generate-index');

generateTranslationIndexes();
webpack(require(./webpack.config.js));
```

#### Statically embedding locale-specific translations

For large applications, even asynchronously loaded translations can significantly degrade the user experience:

- Bundlers like webpack have to embed kilobytes of data to track each translation import
- Users not using the "default" language have to download kilobytes of translations for every language

To avoid this, it is possible to build versions of app with specific locale translations embedded directly in JavaScript. To achieve this, run the Babel plugin in `from-dictionary-index` mode:

```js
// webpack.config.js
{
  plugins: [
    ['@shopify/react-i18n/babel', {mode: 'from-dictionary-index'}],
  ],
}
```

Then generate `translations/index.js` files containing specific locale data using the `@shopify/react-i18n/generate-dictionaries` helper. e.g., the following code generates three versions of an application with English, French, and German content using webpack.

```js
// generate-translations.js
const {
  generateTranslationDictionaries,
} = require('@shopify/react-i18n/generate-dictionaries');

// Build English app.
await generateTranslationDictionaries(['en']);
webpack(require(./webpack.config.js));

// Build French app.
await generateTranslationDictionaries(['fr'], {fallbackLocale: 'en'});
webpack(require(./webpack.config.js));

// Build German app.
await generateTranslationDictionaries(['de'], {fallbackLocale: 'en'});
webpack(require(./webpack.config.js));

```

#### Setting the default locale to something other than `en`

If you want your default locale to be something else than English because it's not your primary locale, you can pass the `defaultLocale` option to the babel plugin:

```
// webpack.config.js
{
  plugins: [
    ['@shopify/react-i18n/babel', {defaultLocale: 'fr'}],
  ],
}
```

## FAQ

### Why another i18n library? Why not just use <[react-intl](https://github.com/yahoo/react-intl) | [react-i18next](https://github.com/i18next/react-i18next)> etc?

These libraries are excellent, and we may well use parts of them under the hood for this project. However, we wanted to add a Shopify-specific layer that cleanly exposes some features we feel are non-negotiable:

- Per-component management of translations, to avoid the ever-growing translation files that hurt our largest apps.
- Asynchronous loading of translation files, so that we can scale the number of supported languages without increasing bundle sizes.
- An API for translations that feels consistent with Rails’ default i18n utilities.
- Exposing currency and datetime formatting utilities that automatically follow the [Polaris conventions](https://polaris.shopify.com/content/grammar-and-mechanics#section-dates-numbers-and-addresses).

Additional details on why we built our own package, and on specifics of parts of this package’s API, are available in the [original proposal](https://github.com/Shopify/web-configs/pull/3).

### How do I get this i18n library to work with React Native?

[React Native does not support dynamic imports](https://github.com/facebook/metro/issues/52). By default, this library uses dynamic imports to asynchronously load translations. As of version [2.3.0](https://github.com/Shopify/quilt/blob/master/packages/react-i18n/CHANGELOG.md#230---2019-11-29), you can update the mode to `from-dictionary-index` so that imports happen synchronously. This allows React Native support for the library. To read more about `from-dictionary-index`, go to [Statically embedding locale-specific translations](#statically-embedding-locale-specific-translations).

**Note**: You will need a script to generate `index` files:

```javascript
const {
  generateTranslationDictionaries,
} = require('@shopify/react-i18n/generate-dictionaries');

const SUPPORTED_LOCALES = ['en'];

(async () => {
  await generateTranslationDictionaries(SUPPORTED_LOCALES, {
    fallbackLocale: 'en',
  });
})();
```
