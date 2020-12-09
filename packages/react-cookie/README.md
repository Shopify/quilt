# `@shopify/react-cookie`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-cookie.svg)](https://badge.fury.io/js/%40shopify%2Freact-cookie.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-cookie.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-cookie.svg)

Cookies in React for the server and client.

## Installation

```bash
$ yarn add @shopify/react-cookie
```

## Usage

### Server

To extract cookies during the server-side render of your application, your component needs to have access to the `NetworkManager` from `@shopify/react-network`. You can pass the initial server cookie value when the manager is instantiated within your server-side middleware.

For full details on setting up `@shopify/react-network`, [see the readme for that package](https://github.com/Shopify/quilt/tree/master/packages/react-network#server).

_Koa Server Example_

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

To use the [`useCookie()` hook](#hooks) provided by this library, you must first wrap your client-side application tree in the `<CookieUniversalProvider />` component.

_React App Provider Example_

```tsx
// App.tsx

import {CookieUniversalProvider} from '@shopify/react-cookie';
import {SomeComponent} from './someComponent'; // see `hooks` example below

function App() {
  <CookieUniversalProvider>
    // rest of your tree
    <SomeComponent />
  </CookieUniversalProvider>;
}
```

### Hooks

#### `useCookie(name: string)`

This hook is called with the name of a given cookie and returns the current value and a setter for that cookie. If the setter is called without a value argument, it will remove the cookie.

_React Hook Example_

```tsx
// SomeComponent.tsx

import React from 'react';
import {useCookie} from '@shopify/react-cookie';

function SomeComponent() {
  const [cookie, setCookie] = useCookie('fooCookie');
  const handleChange = event => setCookie(event.target.value);
  const removeCookie = () => setCookie();

  return (
    <>
      <p>the cookie is {cookie}</p>
      <TextField value={cookie} onChange={handleChange} />
      <button type="button" onClick={removeCookie}>
        Remove Cookie
      </button>
    </>
  );
}
```

### Utilities

#### `createCookies()`

This utility can be used to create an initial set of cookies in the `document.cookie`. This can be useful in test set up.

#### `clearCookies()`

This utility can be used to clear a set of cookies from the `document.cookie`. This can be useful when you need to clear the cookies between tests, such as in an `afterEach` block.
