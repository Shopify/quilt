# `@shopify/react-graphql-universal-provider`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-graphql-universal-provider.svg)](https://badge.fury.io/js/%40shopify%2Freact-graphql-universal-provider.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-graphql-universal-provider.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-graphql-universal-provider.svg)

A self-serializing/deserializing GraphQL provider that works for isomorphic applications.

## Installation

```bash
$ yarn add @shopify/react-graphql-universal-provider
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

## Usage

#### Props

The component takes children and a function that can create an Apollo client. This function will be called when needed, and the resulting Apollo client will be augmented with the serialized initial data.

The Apollo Client by default has the following option values. These values can also be overwritten using the return value of the `createClientOptions` prop.

```js
const IS_SERVER = typeof window === 'undefined';

const defaultClientOptions = {
  cache: new InMemoryCache()
  ssrMode: IS_SERVER,
  ssrForceFetchDelay: 100,
  connectToDevTools: !IS_SERVER,
};
```

#### Basic Example

```tsx
// App.tsx

import {GraphQL} from '../GraphQL';

export function App({url}: {url: URL}) {
  return <GraphQL url={url}>{/* rest of the app */}</GraphQL>;
}
```

```tsx
// GraphQL.tsx
import React from 'react';
import fetch from 'cross-fetch';
import {createHttpLink} from 'apollo-link-http';
import {GraphQLUniversalProvider} from '@shopify/react-graphql-universal-provider';

export function GraphQL({
  url,
  children,
}: {
  url: URL;
  children?: React.ReactNode;
}) {
  const createClientOptions = () => {
    const link = createHttpLink({
      // make sure to use absolute URL on the server
      uri: `${url.origin}/graphql`,
      fetch,
    });

    return {link};
  };

  return (
    <GraphQLUniversalProvider createClientOptions={createClientOptions}>
      {children}
    </GraphQLUniversalProvider>
  );
}
```

You’ll know that this library is hooked up properly when the HTML response from server-side rendering:

- contains a `<script type="text/json" data-serialized-id="apollo"></script>` element with the contents set to a JSON representation of the contents of the Apollo cache, and
- does not present the loading state for any GraphQL-connected component that shows data immediately when available (this excludes any queries with a `fetchPolicy` that ignores the cache).

#### Using it with cookie

This example will also show getting cookie using `@shopify/react-network` but this is certainly not an requirement.

```tsx
// App.tsx
import React from 'react';
import {GraphQL} from '../GraphQL';

export function App({url}: {url: URL}) {
  return <GraphQL url={url}>{/* rest of the app */}</GraphQL>;
}
```

```tsx
// GraphQL.tsx
import React from 'react';
import fetch from 'cross-fetch';
import {createHttpLink} from 'apollo-link-http';
import {useRequestHeader} from '@shopify/react-network';
import {GraphQLUniversalProvider} from '@shopify/react-graphql-universal-provider';

function GraphQL({url, children}: {url: URL; children?: React.ReactNode}) {
  const cookie = useRequestHeader('cookie');

  const createClientOptions = () => {
    const link = createHttpLink({
      // make sure to use absolute URL on the server
      uri: `${url.origin}/graphql`,
      fetch,
      headers: {
        cookie,
      },
    });

    return {link};
  };

  return (
    <GraphQLUniversalProvider createClientOptions={createClientOptions}>
      {children}
    </GraphQLUniversalProvider>
  );
}
```
