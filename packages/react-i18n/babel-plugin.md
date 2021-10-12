# `@shopify/react-i18n/babel`

This package includes a plugin for Babel that auto-fills `useI18n`'s or `withI18n`'s arguments from an adjacent translations folder.

## Installation

```bash
$ yarn add @shopify/react-i18n
```

## Usage

The Babel plugin is exported from the `@shopify/react-i18n/babel` entrypoint:

```js
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@shopify/react-i18n/babel'],
          },
        },
      },
    ],
  },
};
```

This plugin will look for an adjacent _`translations`_ folder containing, at minimum, an `en.json` file (the default locale). It will then iterate over each reference to the `useI18n` hook or `withI18n` decorator and, if the reference is a call expression with no arguments, and inject the appropriate arguments.

### Default Transform

Given folder structure

```
├── MyComponent.tsx
└── translations
   └── en.json
   └── fr.json
   └── jp.json

```

File content

```js
// Within translations/en.js

{
  "heading": "All Films"
}

// Within translations/fr.js

{
  "heading": "fr_All Films"
}

// Within translations/jp.js

{
  "heading": "jp_All Films"
}
```

```js
// Within MyComponent.tsx:

useI18n();

// Becomes:

import _en from './translations/en.json';

useI18n({
  id: 'MyComponent_<hash>',
  fallback: _en,
  async translations(locale) {
    if (['fr', 'jp'].indexOf(locale) < 0) {
      return;
    }

    return import(
      /* webpackChunkName: "MyComponent_<hash>-i18n", webpackMode: "lazy-once" */ `./translations/${locale}.json`
    ).then((dict) => dict && dict.default);
  },
});
```

## Options

### `mode`

Type: `with-dynamic-paths`, `with-explicit-paths`, `from-generated-index`, `from-dictionary-index`

Default: `with-dynamic-paths`

#### `with-explicit-paths`

_*Use this mode with bundlers that require import paths to be explicit.*_

The babel plugin uses dynamic imports by default to resolve translation locations. Some bundlers however require that imports be explicity stated so that the bundler knows what files are to be included in the final generated bundle. Examples of bundlers with this behaviour include [Metro](https://facebook.github.io/metro/) and [rollup.js](https://rollupjs.org/guide/en/). Configure the plugin to use explicit paths rather than dynamic imports with the `with-explicit-paths` options.

##### Usage

```js
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@shopify/react-i18n/babel',
              {mode: 'with-explicit-paths'},
            ],
          },
        },
      },
    ],
  },
};
```

#### Transform

With two locale translation files (default being `en`):

```js
// After auto-fill:

import _en from './translations/en.json';

useI18n({
  id: 'MyComponent_<hash>',
  fallback: _en,
  async translations(locale) {
    if (locale !== 'jp') {
      return;
    }

    return import(
      /* webpackChunkName: "MyComponent_<hash>-i18n" */ './translations/jp.json'
    ).then((dict) => dict && dict.default);
  },
});
```

With three or more locale translation files (default being `en`):

```js
// After auto-fill:

import _en from './translations/en.json';

useI18n({
  id: 'MyComponent_<hash>',
  fallback: _en,
  async translations(locale) {
    const returnDefault = (dict) => dict && dict.default;

    switch (locale) {
      case 'fr':
        return import(
          /* webpackChunkName: "MyComponent_<hash>-i18n" */ './translations/fr.json'
        ).then(returnDefault);
      case 'jp':
        return import(
          /* webpackChunkName: "MyComponent_<hash>-i18n" */ './translations/jp.json'
        ).then(returnDefault);
    }
  },
});
```

#### `from-generated-index`

_*Use this mode to avoid caching issues when integrating with babel-loader.*_

Because `babel-loader`'s cache is based on a component's source content hash, newly added translation files will not invalidate the component's Babel cache. To combat this, run the `generateTranslationIndexes` function before building, and configure the plugin to use its `from-generated-index` mode.

The generator will look for any `translations` folders and generate an array of local ids in `translations/index.js` based on the `{locale}.json` files found. We recommend that you add `**/translations/index.js` to `.gitignore` to make sure the generated files are not checked-in.

##### Usage

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

##### Transform

```js
// Generated translations/index.js from generateTranslationIndexes()
export default ['fr', 'jp'];
```

```js
// Within MyComponent.tsx:

useI18n();

// Becomes:

import _en from './translations/en.json';
import __shopify__i18n_translations from './translations';

useI18n({
  id: 'MyComponent_<hash>',
  fallback: _en,
  async translations(locale) {
    if (__shopify__i18n_translations.indexOf(locale) < 0) {
      return;
    }

    return import(
      /* webpackChunkName: "MyComponent_<hash>-i18n", webpackMode: "lazy-once" */ `./translations/${locale}.json`
    ).then((dict) => dict && dict.default);
  },
});
```

#### `from-dictionary-index`

_*Use this mode to statically embed locale-specific translations.*_

For large applications, even asynchronously loaded translations can significantly degrade the user experience:

- Bundlers like webpack have to embed kilobytes of data to track each translation import
- Users not using the "default" language have to download kilobytes of translations for every language

To avoid this, it is possible to build versions of app with specific locale translations embedded directly in JavaScript.

##### Usage

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

##### Transform

```js
// Generated translations/index.js using generateTranslationDictionaries(['fr'], {fallbackLocale: 'en'});

export default JSON.parse(
  '{"en":{"heading":"All Films"},"fr":{"heading":"fr_All Films"}}',
);
```

```js
// Within MyComponent.tsx:

useI18n();

// Becomes:
import __shopify__i18n_translations from './translations';

useI18n({
  id: 'MyComponent_<hash>',
  fallback: Object.values(__shopify__i18n_translations)[0],
  translations(locale) {
    return Promise.resolve(__shopify__i18n_translations[locale]);
  },
});
```

### `defaultLocale`

Type: `string`

Default: `en`

#### Setting the default locale to something other than `en`

If you want your default locale to be something else than English because it's not your primary locale, you can pass the `defaultLocale` option to the babel plugin:

```js
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [['@shopify/react-i18n/babel', {defaultLocale: 'fr'}]],
          },
        },
      },
    ],
  },
};
```
