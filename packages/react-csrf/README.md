# `@shopify/react-csrf`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-csrf.svg)](https://badge.fury.io/js/%40shopify%2Freact-csrf.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-csrf.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-csrf.svg)

Share CSRF tokens throughout a React application.

## Installation

```bash
$ yarn add @shopify/react-csrf
```

## Usage

Setup the Provider around all of the application that need to access csrf token.

```tsx
// App.tsx
import * as React from 'react';
import {CsrfTokenContext} from '@shopify/react-csrf';

function App({token}: {token?: string}) {
  return (
    <CsrfTokenContext.Provider value={token}>
      {/* rest of the app */}
    </CsrfTokenContext.Provider>
  );
}
```

Access csrf token using `useCsrfToken` hook:

```tsx
import React from 'react';
import {useCsrfToken} from '@shopify/react-csrf';

export default function MyToken() {
  const csrfToken = useCsrfToken();
  return <p>My CSRF Token is: {csrfToken}</p>;
}
```
