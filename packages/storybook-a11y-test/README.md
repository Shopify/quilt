# `@shopify/storybook-a11y-test`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg)](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/useful-types.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/useful-types.svg)

Test storybook pages with axe and puppeteer.

## Installation

```bash
$ yarn add @shopify/storybook-a11y-test
```

## Usage

Make sure you have built your storybook instance and there is an `iframe.html` file that you can point the test towards.

```js
const {testPages, getCurrentStoryIds} = require('./built-a11y-package');

(async () => {
  const iframePath = `file://${__dirname}/../build/storybook/static/iframe.html`;
  const timeout = 1000;
  const storyIds = await getCurrentStoryIds({iframePath, skippedStoryIds: []});
  const results = await testPages({iframePath, storyIds, timeout});

  if (results.length) {
    console.error(`‼️  Test failures found`);
    console.log(results.join('\n'));
    process.exit(1);
  } else {
    console.log('🧚‍♀️ Accessibility is all g');
  }
})();
```

## API

### getCurrentStoryIds(options)

#### iframePath `string`

The location of the built storybook `iframe.html` file.

#### skippedStoryIds `array` (optional)

An array of storybook id's to skip.

### testPages(options)

#### iframePath `string`

The location of the built storybook `iframe.html` file.

#### storyIds

An array of storybook id's to run. These can be retrieved via the `getCurrentStoryIds()` function.

#### concurrentCount `number` (optional)

The number of tabs to open in chromium. The default option is based off the number of CPU cores available `os.cpus().length`.

#### timeout `number` (optional)

The goto timeout for the provided url. Defaults to 3000 (puppeteer default)
