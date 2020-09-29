# `@shopify/react-universal-provider`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-universal-provider.svg)](https://badge.fury.io/js/%40shopify%2Freact-universal-provider.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-universal-provider.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-universal-provider.svg)

Factory function and utilities to create self-serializing/deserializing providers that work for isomorphic applications.

## Table of contents

1. [Installation](#installation)
1. [What is a Universal Provider?](#what-is-a-universal-provider)
1. [Usage](#usage)

## Installation

```bash
$ yarn add @shopify/react-universal-provider
```

## What is a Universal Provider ?

A universal provider is a React component that leverages the `useSerialized()` hook from `@shopify/react-html` to handle both serializing data during server rendering, and deserializing it on the client. The components often render `React.context()` providers to make their serialized state available to the rest of the app they're rendered in.

### Comparison with traditional serialization techniques

Consider the [`I18nUniversalProvider`](../react-i18n-universal-provider). In the server you may want to set the locale based on the `Accept-Language` header. The client needs to be informed of this somehow to make sure React can render consistently. Traditionally you might do something like:

#### On the server

- Get the locale from the `Accept-Language` header in your node server
- Create an instance of `I18nManager` with that locale
- Pass the instance into your app
- Render a `<Serialize name="locale" />` component in the DOM you send to the client

#### On the client

- Call `getSerialized('locale')` in your client entry point for your locale
- Create an instance of `I18nManager` with that locale
- Pass the instance into your app

#### In your react app's universal code

- Have your app render an `<I18nProvider />` with the manager from props

With universal provider you would instead:

#### On the server

- Get the locale from the `Accept-Language` header in your node server
- Pass the locale into your app directly

#### On the client

- Render your app without passing in the locale

#### In your react app's universal code

- Have your app render an [`I18nUniversalProvider`](../react-i18n-universal-provider) with the locale from props

Since universal provider handle the details of serialization they allow you to remove code from your client/server entry points and instead let the react app itself handle those concerns.

## Usage

This package provide a function which can be use to create a universal provider given a React Context object.
It is particularly useful for simple object or primitive that need to be sync up between the server and client.

The list below show a few packages with more complex universal provider:

[@shopify/react-app-bridge-universal-provider](../react-app-bridge-universal-provider)
[@shopify/react-csrf-universal-provider](../react-csrf-universal-provider)
[@shopify/react-graphql-universal-provider`](../react-graphql-universal-provider)
[@shopify/react-i18n-universal-provider](../react-i18n-universal-provider)

### `createUniversalProvider`

#### Options

The function takes a unique id and a React Context object.

#### Props

The resulting Provider takes children and a data prop.

```tsx
interface Props<Value> {
  value?: Value;
  children?: React.ReactNode;
}
```

#### Example

```tsx
//ApiKeyUniversalProvider.tsx
import {createContext} from 'react';
import {createUniversalProvider} from '@shopify/react-universal-provider';

export const ApiKeyContext = createContext<string | null>(null);
export const ApiKeyUniversalProvider = createUniversalProvider(
  'api-key',
  ApiKeyContext,
);
```

```tsx
// App.tsx
import {ApiKeyProvider} from './ApiKeyProvider';

function App({apiKey}: {apiKey?: string}) {
  return (
    <ApiKeyProvider value={apiKey}>{/* rest of the app */}</ApiKeyProvider>
  );
}
```
