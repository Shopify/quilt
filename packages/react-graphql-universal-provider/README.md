# `@shopify/react-graphql-universal-provider`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-graphql-universal-provider.svg)](https://badge.fury.io/js/%40shopify%2Freact-graphql-universal-provider.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-graphql-universal-provider.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-graphql-universal-provider.svg)

A self-serializing/deserializing GraphQL provider that works for isomorphic applications.

## Installation

```bash
$ yarn add @shopify/react-graphql-universal-provider
```

## Usage

#### Props

The component takes children and a function that can create an Apollo client. This function will be called when needed, and the resulting Apollo client will be augmented with the serialized initial data.

#### Basic Example

```tsx
// App.tsx

import {GraphQL} from '../GraphQL';

function App({server}: {server?: boolean}) {
  return <GraphQL server={server}>{/* rest of the app */}</GraphQL>;
}
```

```tsx
// GraphQL.tsx

import {InMemoryCache} from 'apollo-inmemory-cache';
import {createHttpLink} from 'apollo-link-http';

import {GraphQLUniversalProvider} from '@shopify/react-graphql-universal-provider';

function GraphQL({
  server,
  children,
}: {
  server?: boolean;
  children?: React.ReactNode;
}) {
  const createClientOptions = () => {
    const link = createHttpLink({
      // make sure to use absolute URL on the server
      uri: `https://your-api-end-point/api/graphql`,
    });

    return {
      link,
      cache: new InMemoryCache(),
      ssrMode: server,
      ssrForceFetchDelay: 100,
      connectToDevTools: !server,
    };
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

#### Using it with csrf token

We suggest that you use `@shopify/react-csrf-universal-provider` to share csrf token in your application.

This example will also show getting the csrf token and cookie using `@shopify/react-network` but this is certainly not an requirement.

```tsx
// App.tsx

import {CsrfUniversalProvider} from '@shopify/react-csrf-universal-provider';
import {useRequestHeader} from '@shopify/react-network';
import {GraphQL} from '../GraphQL';

function App({server}: {server?: boolean}) {
  const csrfToken = useRequestHeader('x-csrf-token');

  return (
    <CsrfUniversalProvider value={csrfToken}>
      <GraphQL server={server}>{/* rest of the app */}</GraphQL>
    </CsrfUniversalProvider>
  );
}
```

```tsx
// GraphQL.tsx

import {InMemoryCache} from 'apollo-inmemory-cache';
import {createHttpLink} from 'apollo-link-http';

import {useRequestHeader} from '@shopify/react-network';
import {GraphQLUniversalProvider} from '@shopify/react-graphql-universal-provider';
import {useCsrfToken} from '@shopify/react-csrf';

function GraphQL({
  server,
  children,
}: {
  server?: boolean;
  children?: React.ReactNode;
}) {
  const cookie = useRequestHeader('cookie');
  const csrfToken = useCsrfToken();

  const createClientOptions = () => {
    const link = createHttpLink({
      // make sure to use absolute URL on the server
      uri: `https://your-api-end-point/api/graphql`,
      headers: {
        cookie,
        'X-CSRF-Token': csrfToken,
      },
    });

    return {
      link,
      cache: new InMemoryCache(),
      ssrMode: server,
      ssrForceFetchDelay: 100,
      connectToDevTools: !server,
    };
  };

  return (
    <GraphQLUniversalProvider createClientOptions={createClientOptions}>
      {children}
    </GraphQLUniversalProvider>
  );
}
```
