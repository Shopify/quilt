# `@shopify/react-google-analytics`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-google-analytics.svg)](https://badge.fury.io/js/%40shopify%2Freact-google-analytics.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-google-analytics.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-google-analytics.svg)

Allows React apps to easily embed Google Analytics scripts.

## Installation

```bash
$ yarn add @shopify/react-google-analytics
```

## Usage

This library exports a `<Universal />` & a `<GaJS />` component, which allows React apps to easily embed Google Analytics scripts.

## analytics.js example

---

```jsx
import {Universal} from '@shopify/react-google-analytics';

const UNIVERSAL_GA_ACCOUNT_ID = 'UA-xxxx-xx';

<Universal
  account={UNIVERSAL_GA_ACCOUNT_ID}
  domain={shopDomain}
  disableTracking
  debug
  // NOTE: This prop will load and set the debug mode for Google Analytics
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging
/>;
```

#### Set custom variables for analytics.js

```jsx
import {Universal} from '@shopify/react-google-analytics';

const UNIVERSAL_GA_ACCOUNT_ID = 'UA-xxxx-xx';

<Universal
  account={UNIVERSAL_GA_ACCOUNT_ID}
  domain={shopDomain}
  set={{
    foo: 'bar', // This translates to ga('set', 'foo', 'bar');
  }}
/>;
```

#### Getting access to the universal tracking instance

```jsx
import {Universal} from '@shopify/react-google-analytics';

const UNIVERSAL_GA_ACCOUNT_ID = 'UA-xxxx-xx';

<Universal
  account={UNIVERSAL_GA_ACCOUNT_ID}
  domain={shopDomain}
  onLoad={ga => {
    this.ga = ga;
  }}
/>;

<button
  onClick={() => {
    this.ga('send', 'event', 'Videos', 'play', 'Cool Video');
  }}
>
  Play Video
</button>;
```

#### Handling Errors

As browsers become more strict and tracking scripts blocked more frequently by users, there is a good chance this component will not be able to embed the Google Analytics script as intended. For these cases, you can pass an `onError` callback as follows:

```jsx
import {Universal} from '@shopify/react-google-analytics';

const UNIVERSAL_GA_ACCOUNT_ID = 'UA-xxxx-xx';

<Universal
  account={UNIVERSAL_GA_ACCOUNT_ID}
  domain={shopDomain}
  onError={error => {
    // do something with error
  }}
/>;
```

For more info on using analytics.js see the [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/)

## ga.js example

---

`WARNING: ga.js is a legacy library. If you are starting a new implementation, we recommend you use the latest version of this library, analytics.js.`

```jsx
import {GaJS} from '@shopify/react-google-analytics';

const GA_JS_ACCOUNT_ID = 'UA-xxxx-xx';

<GaJS
  account={GA_JS_ACCOUNT_ID}
  domain={shopDomain}
  disableTracking
  // NOTE: Disables the tracking snippet from sending data to Google Analytics.
  // https://developers.google.com/analytics/devguides/collection/gajs/#disable
/>;
```

#### Set custom variables for ga.js

```jsx
import {GaJS} from '@shopify/react-google-analytics';

const GA_JS_ACCOUNT_ID = 'UA-xxxx-xx';

<GaJS
  account={GA_JS_ACCOUNT_ID}
  domain={shopDomain}
  set={{
    foo: 'bar', // This translates to _gaq.push(['foo', 'bar']);
  }}
/>;
```

#### Getting access to the ga tracking instance

```jsx
import {GaJS} from '@shopify/react-google-analytics';

const GA_JS_ACCOUNT_ID = 'UA-xxxx-xx';

<GaJS
  account={GA_JS_ACCOUNT_ID}
  domain={shopDomain}
  onLoad={_gaq => {
    this._gaq = _gaq;
  }}
/>;

<button
  onClick={() => {
    this._gaq.push(['_trackEvent', 'button3', 'clicked']);
  }}
>
  Play Video
</button>;
```

For more info on using ga.js see the [documentation](https://developers.google.com/analytics/devguides/collection/gajs/)
