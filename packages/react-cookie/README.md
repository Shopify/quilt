# `@shopify/react-cookie`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-cookie.svg)](https://badge.fury.io/js/%40shopify%2Freact-cookie.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-cookie.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-cookie.svg)

Cookies in React for the server and client

## Installation

```bash
$ yarn add @shopify/react-cookie
```

## Usage

To use the hooks provided by this library you must first wrap your application tree in a the `<Cookie />` component.

```tsx
// App.tsx

import {Cookie} from '@shopify/react-cookie';
import {SomeComponent} from './someComponent';

function App() {
  <Cookie>
    // rest of your tree
    <SomeComponent />
  </Cookie>;
}
```

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

This hook returns a single-item array that is an object of all the current cookies.

```tsx
function MyComponent() {
  const [allCookies] = useCookies();

  const cookiesMarkup = Object.keys(allCookies).map(key => (
    <p key={key}>{allCookies[key].value}</p>
  ));

  return <>{cookiesMarkup}</>;
}
```

#### `useCookie(name: string)`

This hook is called with the name of a given cookie and returns the current value of the cookie and a way to set the value of the cookie.

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
