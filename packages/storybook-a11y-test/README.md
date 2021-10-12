# `@shopify/storybook-a11y-test`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/Shopify/quilt/blob/main/LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fstorybook-a11y-test.svg)](https://www.npmjs.com/package/@shopify/storybook-a11y-test) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/storybook-a11y-test.svg)](https://bundlephobia.com/package/@shopify/storybook-a11y-test)

Test [Storybook](https://storybook.js.org/) stories with [axe®](https://github.com/dequelabs/axe-core) and [Puppeteer](https://developers.google.com/web/tools/puppeteer).

## Installation

Add this package to your project’s development dependencies.

```bash
$ yarn add @shopify/storybook-a11y-test --dev
```

This assumes you’ve installed and set up the [Storybook accessibility addon](https://www.npmjs.com/package/@storybook/addon-a11y).

In your project’s `package.json`, add the `build-storybook` and `storybook-a11y-test` scripts:

```json5
// package.json
"scripts": {
  "build-storybook": "build-storybook --static-dir=.storybook/public --output-dir=build/storybook/static",
  "storybook-a11y-test": "node ./scripts/storybook-a11y-test.js"
},
```

### CI steps

Your CI steps should include:

1. Building Storybook (`yarn run build-storybook`)
2. Running the script (`yarn run storybook-a11y-test`)

For example:

```yaml
steps:
  - label: ':storybook: Build Storybook and run accessibility tests'
    run:
      - yarn install
      - yarn run build-storybook
      - yarn run storybook-a11y-test
```

For optimal test performance, break the build and accessibility testing steps into two separate steps, as illustrated in [🔒 this example](https://github.com/Shopify/web/blob/03475cd0918c0e18989c1974d7007c1bd912e054/.shopify-build/shared/steps.yml#L154-L184) (only visible to Shopify employees).

## Usage

Make sure you have built your Storybook instance and there is an `iframe.html` file that you can point the test towards.

```js
const {testPages, getCurrentStoryIds} = require('@shopify/storybook-a11y-test');

(async () => {
  // Custom URL or file path to Storybook’s iframe
  const iframePath = `file://${__dirname}/../build/storybook/static/iframe.html`;

  // Grab all Story IDs
  const storyIds = await getCurrentStoryIds({
    iframePath,

    // Optional, IDs of stories that shouldn’t be tested (for example: playgrounds)
    skippedStoryIds: [],
  });

  // Run tests on all stories in `storyIds`
  const results = await testPages({
    iframePath,
    storyIds,

    // Optional: maximum time in milliseconds to wait for the browser instance to start.
    // Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
    timeout: 30000,
  });

  if (results.length) {
    console.error(`‼️  Accessibility violations found`);
    console.log(results.join('\n'));
    process.exit(1);
  } else {
    console.log('🧚  Accessibility tests passed');
  }
})();
```

### Ignoring violations in a Story

When is it okay to ignore accessibility violations?

- False positives
- Work in progress, early stages of building a component
- Playgrounds, prototypes, work in progress…

```js
MyStory.parameters = {
  a11y: {
    // 🙅‍♀️ Don't do this!
    disable: true, // 💩💩💩
    // It disables all accessibility checks for the story,
    // and we won't know when we introduce regressions.
    //
    // 🙌 Instead, override single rules on specific elements.
    // 👇 see guidelines below

    // @see axe-core configParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
    config: {
      rules: [
        {
          // False positives on specific elements
          //
          // You can exclude some elements from raising errors for a specific rule.
          id: 'failing-rule-id',
          selector: '*:not(<selector triggering violation>)',
        },
        {
          // False positive on an entire component
          //
          // In certain cases (like a disabled button), it's okay to disable a rule.
          id: 'failing-rule-id',
          enabled: false,
        },
        {
          // Temporary override (failure "needs review")
          //
          // `reviewOnFail: true` overrides the result of a rule to return
          // "Needs Review" rather than "Violation" if the rule fails.
          //
          // Useful when merging unfinished or early stage work.
          id: 'failing-rule-id',
          reviewOnFail: true,
        },
      ],
    },
  },
};
```

### Ignoring violations: examples

```ts
AutocompleteField.parameters = {
  a11y: {
    config: {
      rules: [
        {
          // Add support for `autocomplete="nope"`, a workaround to prevent autocomplete in Chrome
          //
          // @link https://bugs.chromium.org/p/chromium/issues/detail?id=468153
          // @link https://development.shopify.io/engineering/developing_at_Shopify/accessibility/forms/autocomplete
          id: 'autocomplete-valid',
          selector: '*:not([autocomplete="nope"])',
        },
      ],
    },
  },
};
```

```ts
DisabledButton.parameters = {
  a11y: {
    config: {
      rules: [
        {
          // Color contrast ratio doesn't need to meet 4.5:1, as the element is disabled
          //
          // @link https://dequeuniversity.com/rules/axe/4.3/color-contrast
          id: 'color-contrast',
          enabled: false,
        },
      ],
    },
  },
};
```

```ts
PrototypeComponent.parameters = {
  a11y: {
    config: {
      rules: [
        {
          // Page-level semantics cause a violation and need to be reworked.
          // Currently discussing solutions with the accessibility team.
          //
          // @link https://github.com/Shopify/shopify/issues/123
          // @link https://dequeuniversity.com/rules/axe/4.3/landmark-complementary-is-top-level
          id: 'landmark-complementary-is-top-level',
          reviewOnFail: true,
        },
      ],
    },
  },
};
```

## API

### getCurrentStoryIds(options)

#### iframePath `string`

The location of the built Storybook `iframe.html` file.

#### skippedStoryIds `array` (optional)

An array of Storybook Story IDs to skip.

### testPages(options)

#### iframePath `string`

The location of the built Storybook `iframe.html` file.

#### storyIds

An array of Storybook IDs to run. These can be retrieved via the `getCurrentStoryIds()` function.

#### concurrentCount `number` (optional)

The number of tabs to open in Chromium. The default option is based off the number of CPU cores available `os.cpus().length`.

#### timeout `number` (optional)

The goto timeout for the provided url. Defaults to `3000`
