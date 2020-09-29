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

### Application

This library provides a number of React hooks and components you can use anywhere in your application to register network-related details on the server.

#### `useRedirect()` and `<Redirect />`

Specifies a redirect location. `applyToContext` will call `ctx.redirect()` with the passed URL, and set the status code, if you pass the `code` prop.

```tsx
import {useRedirect, Redirect, StatusCode} from '@shopify/react-network';

function MyComponent() {
  useRedirect('/login', StatusCode.SeeOther);

  // or
  return <Redirect url="/login" code={StatusCode.SeeOther} />;
}
```

#### `useStatus()` and `<Status />`

Specifies a status code. `applyToContext` will set `ctx.status` with the passed status code. If multiple status codes are set during the navigation of the tree, the most "significant" one will be used — that is, the status code that is the highest numerically.

```tsx
import {useStatus, Status, StatusCode} from '@shopify/react-network';

function MyComponent() {
  useStatus(StatusCode.NotFound);

  // or

  return <Status code={StatusCode.SeeOther} />;
}
```

#### `useCspDirective()` and content security policy components

This package exports a `useCspDirective()` hook (and many components) for constructing a [content security policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy). Every CSP directive has a matching component in this library that exposes a nice API for setting that directive. When `applyToContext` is run, it will group together all of the directives and set the CSP header.

There are too many to go over individually, but the example below illustrates setting up a simple CSP. Review the available imports from the library for all available components.

```tsx
import {
  useCspDirective,
  DefaultSource,
  StyleSource,
  SpecialSource,
  CspDirective,
  UpgradeInsecureRequests,
} from '@shopify/react-network';

export default function ContentSecurityPolicy() {
  useCspDirective(CspDirective.DefaultSrc, [SpecialSource.Self]);
  useCspDirective(CspDirective.StyleSrc, [
    SpecialSource.Self,
    SpecialSource.UnsafeInline,
  ]);
  useCspDirective(CspDirective.UpgradeInsecureRequests, true);

  // OR

  return (
    <>
      <DefaultSource sources={[SpecialSource.Self]} />
      <StyleSource sources={[SpecialSource.Self, SpecialSource.UnsafeInline]} />
      <UpgradeInsecureRequests />
    </>
  );
}
```

#### `useHeader()` and `useRequestHeader()`

This library allows you to read from request headers, and set response headers. To set a header, call the `useHeader()` hook, which accepts the name of a header and the desired value. `useRequestHeader()`, on the other hand, gives you access to a specified request header.

**Note:** calling `useRequestHeader` on client-side renders will give you `undefined`, since we only have access to the request context on the server. To remedy this, wrap your app in a `NetworkUniversalProvider` (see below for more details).

```tsx
import {useHeader, useRequestHeader} from '@shopify/react-network';

function MyComponent() {
  useHeader('X-React', 'true');
  const acceptLanguage = useRequestHeader('Accept-Language');
  return <div>Requested languages: {acceptLanguage}</div>;
}
```

#### `useAcceptLanguage()`

This hook will read and parse the value of the `Accept-Language` header and return the result in an array of `Language` objects. It takes one argument as the fallback `Language` in case the header is not present.

**Note:** `useAcceptLanguage` calls `useRequestHeader`, so the constraints on client-side renders apply here too. Wrap your app in a `NetworkUniversalProvider` and pass in `[Header.AcceptLanguage]` to the `headers` prop in order to call `useAcceptLanguage` on subsequent client-side renders.

```tsx
import {useAcceptLanguage} from '@shopify/react-network';

function MyComponent() {
  const fallback = {code: 'en', quality: 1.0};
  const locales = useAcceptLanguage(fallback);

  const languages = locales.map(({code, quality, region}) => {
    return `code: ${code}, quality: ${quality}, region: ${region}`;
  });

  return <div>Requested languages: {languages}</div>;
}
```

#### `useNetworkManager()`

Returns the full network manager from context.

```tsx
import React from 'react';
import {useNetworkManager} from '@shopify/react-network';
import {CookieContext} from './context';

export function CookieProvider({children}: Props) {
  const manager = useNetworkManager();

  return (
    <CookieContext.Provider value={manager.cookies}>
      {children}
    </CookieContext.Provider>
  );
}
```

#### `<NetworkUniversalProvider />`

In the case you need to have access to network details on both client and server-side renders, you can wrap your top-level app in `NetworkUniversalProvider` like so:

```tsx
export default function App() {
  return (
    <NetworkUniversalProvider
      headers={['x-some-header', 'x-some-other-header']}
    >
      {
        // rest of your app
      }
    </NetworkUniversalProvider>
  );
}
```

Note that `NetworkContext.Provider` has to be rendered somewhere above in your app (see below).

Currently this universal provider only supports headers, so you can pass in an array of header names to the `headers` prop. Then, in components nested further down in your tree you can get those headers from context using `useRequestHeader` on client-side renders like so:

```tsx
export default function SomeInnerComponent() {
  const someHeaderValue = useRequestHeader('x-some-header');
  const someOtherHeaderValue = useRequestHeader('x-some-other-header');

  return (
    <Markup
      value={someHeaderDependentLogic(someHeaderValue, someOtherHeaderValue)}
    />
  );
}
```

`headers` aren't case-sensitive, but it's a good idea to keep consistent between `NetworkUniversalProvider` and `useRequestHeader`.

### Server

To extract details from your application, render a `NetworkContext.Provider` around your app, and give it an instance of `NetworkManager`. When using `react-effect`, this decoration can be done in the `decorate` option of `extract()`. Finally, you can use the `applyToContext` utility from this package to apply the necessary headers to the response. Your final server middleware will resemble the example below:

```tsx
import React from 'react';
import {render} from '@shopify/react-html/server';
import {extract} from '@shopify/react-effect/server';
import {
  NetworkManager,
  NetworkContext,
  applyToContext,
} from '@shopify/react-network/server';
import App from './App';

export default function renderApp(ctx: Context) {
  // Accepts an optional headers argument for giving access
  // to request headers.
  const networkManager = new NetworkManager({
    headers: ctx.headers,
  });

  const app = <App />;

  await extract(app, {
    decorate: element => (
      <NetworkContext.Provider value={networkManager}>
        {element}
      </NetworkContext.Provider>
    ),
  });

  applyToContext(ctx, networkManager);
  ctx.body = render(
    <NetworkContext.Provider value={networkManager}>
      {app}
    </NetworkContext.Provider>,
  );
}
```

> Note: You can selectively extract _only_ the network details by using the `EFFECT_ID` exported from `@shopify/react-network/server`, and using this as the second argument to `@shopify/react-effect`’s `extract()` as detailed in its documentation. Most consumers of this package will be fine with just the example above.

### Other utilities

This library re-exports the entirety of [`@shopify/network`](https://github.com/Shopify/quilt/tree/master/packages/network), so you do not need to install both.
