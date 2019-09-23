# `@shopify/react-cookie`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-cookie.svg)](https://badge.fury.io/js/%40shopify%2Freact-cookie.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-cookie.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-cookie.svg)

Cookies in React for the server and client

## Installation

```bash
$ yarn add @shopify/react-cookie
```

## Usage

### Server

To extract cookies during the server-side render of your application, your component needs to have access to the `NetworkManager` from `@shopify/react-network`. You can pass the initial server cookie value when the manager is instantiated within your server-side middleware.

For full details on setting up `@shopify/react-server`, [see the readme for that package](https://github.com/Shopify/quilt/tree/master/packages/react-network#server).

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
  const networkManager = new NetworkManager({
    // Here we provide the server cookies
    cookies: ctx.request.headers.cookie || '',
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

### Client

To use the hooks provided by this library you must first wrap your client-side application tree in the `<CookieUniversalProvider />` component.

```tsx
// App.tsx

import {CookieUniversalProvider} from '@shopify/react-cookie';
import {SomeComponent} from './someComponent';

function App() {
  <CookieUniversalProvider>
    // rest of your tree
    <SomeComponent />
  </CookieUniversalProvider>;
}
```

You can then use the [hooks](#hooks) provided by this package.

```tsx
// SomeComponent.tsx

import React from 'react';
import {useCookie} from '@shopify/react-cookie';

function SomeComponent() {
  const [cookie, setCookie] = useCookie('fooCookie');
  const handleChange = event => setCookie(event.target.value);

  return (
    <>
      <p>the cookie is {cookie}</p>
      <TextField value={cookie} onChange={handleChange} />
    </>
  );
}
```

### Hooks

#### `useCookies()`

This hook returns an object of all the current cookies.

```tsx
function MyComponent() {
  const allCookies = useCookies();

  const cookiesMarkup = Object.keys(allCookies).map(key => (
    <p key={key}>{allCookies[key].value}</p>
  ));

  return <>{cookiesMarkup}</>;
}
```

#### `useCookie(name: string)`

This hook is called with the name of a given cookie and returns the current value and a setter for that cookie.

```tsx
function MyComponent({cookie}: {cookie: string}) {
  const [value, setCookie] = useCookie(cookie);

  return (
    <>
      <button type="button" onClick={() => setCookie('baz')}>
        Set Cookie
      </button>
      {value}
    </>
  );
```
