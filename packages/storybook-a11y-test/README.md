# `@shopify/storybook-a11y-test`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fstorybook-a11y-test.svg)](https://badge.fury.io/js/%40shopify%2Fstorybook-a11y-test.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/storybook-a11y-test.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/storybook-a11y-test.svg)

Test [Storybook](https://storybook.js.org/) stories with [Axe](https://github.com/dequelabs/axe-core) and [Puppeteer](https://developers.google.com/web/tools/puppeteer).

## Installation

First, install the package and the [Storybook accessibility addon](https://www.npmjs.com/package/@storybook/addon-a11y):

```bash
$ yarn add @shopify/storybook-a11y-test @storybook/addon-a11y --dev
```

Add this line to your `.storybook/main.js` file.

```js
// .storybook/main.js
module.exports = {
  addons: ['@storybook/addon-a11y'],
};
```

In `.storybook/preview.ts` (you may have to create this file), set these recommended settings for Storybook’s accessibility addon:

```ts
// .storybook/preview.ts
export const parameters = {
  a11y: {
    config: {
      rules: [
        {
          // Add support for `autocomplete="nope"`, a workaround to prevent autocomplete in Chrome
          // @link https://bugs.chromium.org/p/chromium/issues/detail?id=468153
          id: 'autocomplete-valid',
          selector: '*:not([autocomplete="nope"])',
        },
      ],
    },
  },
};
```

In your project’s `package.json`, add these lines:

```json5
// package.json
  "scripts": {
    "build-storybook": "build-storybook --static-dir=.storybook/public --output-dir=build/storybook/static",
    "serve-storybook": "npx http-server build/storybook/static --port=6006",
    "storybook-a11y-test": "node ./scripts/storybook-a11y-test.js"
  }
```

## Usage

### Running the tests locally

Start storybook with `yarn run storybook`, which should start a development server at `http://localhost:6006`.

### CI steps

Your CI steps should include:

1. Building Storybook (`yarn run build-storybook`)
2. Serving the built Storybook on `localhost:6006` (`yarn run serve-storybook`)
3. Running the script (`yarn run storybook-a11y-test`)

### Script

```js
// scripts/storybook-a11y-test.js
const {testPages, getCurrentStoryIds} = require('./built-a11y-package');

(async () => {
  // Grab all Story IDs
  const storyIds = await getCurrentStoryIds({
    // Optional: custom URL or file path to Storybook’s iframe
    iframePath: `http://localhost:6006/iframe.html`,
    // No server? Load the iframe from the filesystem instead:
    // iframePath: `file://${__dirname}/../build/storybook/static/iframe.html`,
    // Optional, IDs of stories that shouldn’t be tested
    skippedStoryIds: []
  });

  // Run tests on all stories in `storyIds`
  const results = await testPages({
    storyIds,
    // Optional: custom URL or file path to Storybook’s iframe
    iframePath: `http://localhost:6006/iframe.html`,

    // Maximum time in milliseconds to wait for the browser instance to start. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
    timeout: 30000,
 });

  if (results.length) {
    console.error(`‼️  Accessibility violations found`);
    console.log(results.join('\n'));
    process.exit(1);
  } else {
    console.log('🧚‍♀️ Accessibility tests passed');
  }
})();
```

### Ignoring specific violations in a Story

```js
MyStory.parameters = {
  a11y: {
    // Don't do this!
    disable: true,

    // Instead, do this 👇
    // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
    options: {
      rules: [
        {
          // Exclude some elements
          // <explain why here>
          id: 'autocomplete-valid',
          selector: '*:not([autocomplete="nope"])',
        },
        {
          // When there's a false positive, it's okay to disable a specific rule, for example:
          // <explain why here>
          // Example:
          // Color contrast ratio doesn't need to meet 4.5:1, as elements are disabled
          // @link https://dequeuniversity.com/rules/axe/4.1/color-contrast?application=axeAPI
          id: 'color-contrast',
          enabled: false,
        },
        {
          // This needs to be fixed in the future
          // <explain why it was set to reviewOnFail>
          id: 'landmark-complementary-is-top-level',
          reviewOnFail: true,
        },
      ],
    },
  },
};
```

---

## API

### getStoryIds(options)

#### iframePath `string`

The location of the built Storybook `iframe.html` file.

#### skippedStoryIds `array` (optional)

An array of Storybook id's to skip.

### testPages(options)

#### iframePath `string`

The location of the built Storybook `iframe.html` file.

#### storyIds

An array of Storybook story IDs to run. These can be retrieved via the `getStoryIds()` function.

#### concurrentCount `number` (optional)

The number of tabs to open in Chromium. The default option is based off the number of CPU cores available `os.cpus().length`.

#### timeout `number` (optional)

The goto timeout for the provided url. Defaults to `30000` (Puppeteer’s default).
