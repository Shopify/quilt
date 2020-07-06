# `@shopify/react-bugsnag`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-bugsnag.svg)](https://badge.fury.io/js/%40shopify%2Freact-bugsnag.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-bugsnag.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-bugsnag.svg)

An opinionated wrapper for Bugsnag's React plugin with smart defaults and support for universal server-side-rendered applications.

## Installation

```bash
$ yarn add @shopify/react-bugsnag
```

## QuickStart

- Create a new project on [bugsnag](https://app.bugsnag.com) and get your API key

```tsx
const API_KEY = 'api-key-from-bugsnag';
```

- Create a bugsnag client instance

```tsx
import {createBugsnagClient} from '@shopify/react-bugsnag';

const API_KEY = 'api-key-from-bugsnag';
const client = createBugsnagClient(API_KEY);
```

- Wrap your React tree with the `<Bugsnag />` component

```tsx
import React from 'react';
import {createBugsnagClient, Bugsnag} from '@shopify/react-bugsnag';

const API_KEY = 'api-key-from-bugsnag';
const client = createBugsnagClient(API_KEY);

function App() {
  return (
    <Bugsang client={client}>
      {/* app code */}
    </Bugsnag>
  );
}
```

Your application should now report runtime errors in the production and staging environments to bugsnag. You are also now able to use `useErrorLogger` anywhere in your application tree in order to manually log to bugsnag.

## API

### Bugsnag

```tsx
<Bugsnag client={client} />
```

The primary API for this library, the `<Bugsnag />` component handles rendering `@bugsnag/react-plugin`'s provider intelligently when the plugin is present on the given `client`. It also automatically omits the `<ErrorBoundary />` when used during Server-Side-Rendering as it relies on DOM globals and would otherwise break. The `<Bugsnag />` component also renders a `ErrorLoggerContext.Provider` with the given `client` as the `value`.

**note: This component does not care how the `client` index was created, whether via the default APIs from `@bugsnag/js` or using the defaults provided by this package's `createBugsnagClient` function.**

### createBugsnagClient

```tsx
createClient({apiKey: 'some-key'});
```

Creates a [bugsnag client](https://docs.bugsnag.com/platforms/javascript/configuration-options/) and passes it a number of sane default configuration options. It must be passed an `apiKey`but all other configutation is optional.

The default configuration options are equivalent to:

```tsx
  releaseStage: process.env.NODE_ENV,
  autoTrackSessions: false,
  enabledReleaseStages: ['production', 'staging'],
  maxBreadcrumbs: 40,
  plugins: [new ReactPlugin()],
```

### useErrorLogger

```tsx
const logger = useErrorLogger();
logger.notify(new Error('manually notifying'));
```

This API provides a way for any component to manually notify. This is ideal for flows such as fetch requests where the error may be handled in the code but you wish to send an error to bugsnag regardless.
