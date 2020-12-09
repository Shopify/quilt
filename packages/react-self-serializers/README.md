# `@shopify/react-self-serializers`

**Note**: This module is now deprecated. Use the following packages instead.

[@shopify/react-app-bridge-universal-provider](../react-app-bridge-universal-provider)
[@shopify/react-graphql-universal-provider`](../react-graphql-universal-provider)
[@shopify/react-i18n-universal-provider](../react-i18n-universal-provider)
[@shopify/react-universal-provider](../react-universal-provider)

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-self-serializers.svg)](https://badge.fury.io/js/%40shopify%2Freact-self-serializers.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-self-serializers.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-self-serializers.svg)

A set of self-serializing providers for [@shopify/react-html](../react-html) applications.

## Table of contents

1. [Installation](#installation)
1. [Self-serializers](#self-serializers)
1. [Usage](#usage)

## Installation

```bash
$ yarn add @shopify/react-self-serializers
```

## Self serializers

A self-serializer is a React component that leverages the `useSerialized()` hook from `@shopify/react-html` to handle both serializing data during server rendering, and deserializing it on the client. The components often render `React.context()` providers to make their serialized state available to the rest of the app they're rendered in.

### Comparison with traditional serialization techniques

Consider the `I18n` self-serializer. In the server you may want to set the locale based on the `Accept-Language` header. The client needs to be informed of this somehow to make sure React can render consistently. Traditionally you might do something like:

#### On the server

- get the locale from the `Accept-Language` header in your node server
- create an instance of `I18nManager` with that locale
- pass the instance into your app
- render a `<Serialize name="locale" />` component in the DOM you send to the client

#### On the client

- call `getSerialized('locale')` in your client entrypoint for your locale
- create an instance of `I18nManager` with that locale
- pass the instance into your app

#### In your react app's universal code

- have your app render an `<I18nProvider />` with the manager from props

With self-serializers you would instead:

#### On the server

- get the locale from the `Accept-Language` header in your node server
- pass the locale into your app directly

#### On the client

- render your app without passing in the locale

#### In your react app's universal code

- have your app render an `<I18n />` with the locale from props

Since self-serializers handle the details of serialization they allow you to remove code from your client/server entrypoints and instead let the react app itself handle those concerns.

## API

### I18n

A self-serializing provider for `@shopify/i18n`'s I18nManager.

#### Props

The component takes an object containing the React children to render and any options to use when configuring the `I18nManager` to provide to the tree.

```tsx
interface Props {
  locale?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  pseudolocalize?: boolean;
  fallbackLocale?: string;
  onError?: ((error: I18nError) => void);
  children?: React.ReactNode;
}
```

#### Example

```tsx
// App.tsx

import {I18n} from '@shopify/react-self-serializers/I18n';

function App({locale}: {locale?: string}) {
  return <I18n locale={locale}>{/* rest of the app */}</I18n>;
}
```

### GraphQL

A self-serializing provider for initial GraphQL data from Apollo.

#### Props

The component takes children and a function that can create an Apollo client. This function will be called when needed, and the resulting Apollo client will be augmented with the serialized initial data.

#### Example

```tsx
interface Props {
  children?: React.ReactNode;
  createClient(): ApolloClient<any>;
}
```

```tsx
// App.tsx
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-inmemory-cache';
import {createHttpLink} from 'apollo-link-http';

import {GraphQL} from '@shopify/react-self-serializers/GraphQL';

function App({
  server,
  shop,
  accessToken,
}: {
  server?: boolean;
  shop?: string;
  accessToken?: string;
}) {
  const createClient = () => {
    const link = createHttpLink({
      uri: `https://${shop}/admin/api/graphql`,
      headers: {'X-Shopify-Access-Token': accessToken},
    });

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      ssrMode: server,
      ssrForceFetchDelay: 100,
      connectToDevTools: !server,
    });
  };

  return <GraphQL createClient={}>{/* rest of the app */}</GraphQL>;
}
```

### `createSelfSerializer`

This factor function will create a Self Serialized Provider given a React Context object.
It is particularly useful for simple object that need to be sync up between the server and client.

#### Options

The function takes a unique id and a React Context object.

#### Props

The resulting Provider takes children and a data prop.

#### Example

```tsx
interface Props {
  data?: Data;
  children?: React.ReactNode;
}
```

```tsx
//ApiKeyProvider.tsx
import {createContext} from 'react';
import {createSelfSerializer} from '@shopify/react-self-serializers/create-self-serializer';

export const ApiKeyContext = createContext<string | null>(null);
export const ApiKeyProvider = createSelfSerializer('api-key', ApiKeyContext);
```

```tsx
// App.tsx
import {ApiKeyProvider} from './ApiKeyProvider';

function App({apiKey}: {apiKey?: string}) {
  return <ApiKeyProvider data={apiKey}>{/* rest of the app */}</ApiKeyProvider>;
}
```

### AppBridge

A self-serializing provider for `@shopify/app-bridge-react`'s Provider.

#### Props

The component takes children, `apiKey`, `shop`, and `forceRedirect`. Similar to `@shopify/app-bridge-react`'s Provider.

```tsx
interface Props {
  apiKey?: string;
  shop?: string;
  forceRedirect?: boolean;
  children?: React.ReactNode;
}
```

#### Example

```tsx
// App.tsx
import {AppBridge} from '@shopify/react-self-serializers/AppBridge';
function App({apiKey, shop}: {apiKey?: string; shop?: string}) {
  return <AppBridge config={{apiKey, shop}}>{/* rest of the app */}</AppBridge>;
}
```
