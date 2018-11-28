# `@shopify/react-network`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-network.svg)](https://badge.fury.io/js/%40shopify%2Freact-network.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-network.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-network.svg)

A collection of components that allow you to set common HTTP headers from within your React application.

## Installation

```bash
$ yarn add @shopify/react-network
```

## Usage

This package uses [`@shopify/react-effect`](https://github.com/Shopify/quilt/tree/master/packages/react-effect) to allow your application to communicate various HTTP-related details to the Node server doing React rendering. It also provides a utility function for easily applying these details to a Koa context object.

To start, have your app accept a `Manager` object, and pass in a `ServerManager` object in your server render (on the client rehydration, you can safely omit any manager, and the library will simply no-op all of the components discussed below):

```tsx
// in App.tsx
import {Manager, Provider} from '@shopify/react-network';

export default function App({networkManager}: {networkManager: Manager}) {
  return <Provider manager={networkManager}>Your app here!</Provider>;
}

// in your server render
import {ServerManager} from '@shopify/react-network';
import App from './App';

export default function render(ctx: Context) {
  const networkManager = new ServerManager();
  const app = <App networkManager={networkManager} />;
}
```

This process lets your server-rendered application store some state about the HTTP details. The next step is to extract this information using `@shopify/react-effect`, and then the `applyToContext` utility from this package to apply it to the response. Your final server middleware will resemble the example below:

```tsx
import {renderToString} from 'react-dom/server';
import {extract} from '@shopify/react-effect/server';
import {ServerManager, applyToContext} from '@shopify/react-network';
import App from './App';

export default function render(ctx: Context) {
  const networkManager = new ServerManager();
  const app = <App networkManager={networkManager} />;
  await extract(app);

  applyToContext(ctx, networkManager);
  ctx.body = renderToString(app);
}
```

> Note: You can selectively extract _only_ the network details by using the `EFFECT_ID` exported from `@shopify/react-network`, and using this as the second argument to `@shopify/react-effect`’s `extract()` as detailed in its documentation. Most consumers of this package will be fine with just the example above.

### `<Redirect />`

Specifies a redirect location. `applyToContext` will call `ctx.redirect()` with the passed URL, and set the status code, if you pass the `status` prop.

```tsx
<Redirect url="/login">
```

### `<Status />`

Specifies a status code. `applyToContext` will set `ctx.status` with the passed status code. If multiple status codes are set during the navigation of the tree, the most "significant" one will be used — that is, the status code that is the highest numerically. The example below illustrates how you can use this component to always return a 404 status code for a `NotFound` component:

```tsx
import {Status, StatusCode} from '@shopify/react-network';

export default function NotFound() {
  return (
    <>
      <div>We couldn’t find that page :(</div>
      <Status code={StatusCode.NotFound} />
    </>
  );
}
```

### Content security policy

This package exports many components for constructing a [content security policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy). Every CSP directive has a matching component in this library that exposes a nice API for setting that directive. When `applyToContext` is run, it will group together all of the directives and set the CSP header.

There are too many to go over individually, but the example below illustrates setting up a simple CSP. Review the available imports from the library for all available components.

```tsx
import {
  DefaultSource,
  StyleSource,
  SpecialSource,
  UpgradeInsecureRequests,
} from '@shopify/react-network';

export default function ContentSecurityPolicy() {
  return (
    <>
      <DefaultSource sources={[SpecialSource.Self]} />
      <StyleSource sources={[SpecialSource.Self, SpecialSource.UnsafeInline]} />
      <UpgradeInsecureRequests />
    </>
  );
}
```

### Other utilities

This library re-exports the entirety of [`@shopify/network`](https://github.com/Shopify/quilt/tree/master/packages/network), so you do not need to install both.
