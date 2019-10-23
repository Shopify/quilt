# `@shopify/react-graphql`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-graphql.svg)](https://badge.fury.io/js/%40shopify%2Freact-graphql.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-graphql.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-graphql.svg)

Tools for creating type-safe and asynchronous GraphQL components for React.

## Installation

```bash
$ yarn add @shopify/react-graphql
```

## Usage

This library builds on top of [react-apollo](https://github.com/apollographql/react-apollo) to provide asynchronously-loaded query components and more strongly-typed queries when used with [`graphql-typescript-definitions`](https://github.com/Shopify/graphql-tools-web/tree/master/packages/graphql-typescript-definitions).

### `Query`

react-apollo’s `Query` component is great, but does not have any built-in understanding of the connection between a GraphQL operation (provided in the `query` prop) and the data types of the resulting query. This library re-exports a `Query` component with improved typings. It will automatically read from from the types embedded in the query by `graphql-typescript-definitions` and use these as appropriate for the rest of the `Query` component’s props.

```tsx
import {Query} from '@shopify/react-graphql';
import myQuery from './graphql/MyQuery.graphql';

// Assuming the following GraphQL API:

//
// type Shop = {
//   id: String!
//   name: String!
// }

// type Query = {
//   shop: Shop!
// }
//
// and the following query:
//
// query MyQuery {
//   shop { id }
// }

// Type error because no variables are allowed
<Query query={query} variables={{}}>{() => null}</Query>

// Type error because name was not queried
<Query query={query}>
  {({data}) => {
    return data ? <div>{data.shop.name}</div> : null;
  }}
</Query>
```

### `createAsyncQueryComponent()`

Another problem with the `Query` component is that it does not work well when trying to preload GraphQL data for another page that is in a different JavaScript bundle. Because the `query` must be provided directly, there is no easy way to keep it from "leaking" into unrelated bundles.

The `createAsyncQueryComponent` function is an equally strong-typed alternative to `Query` that supports asynchronously-loading GraphQL queries. The resulting component also exposes useful `usePreload`, `usePrefetch`, and `useKeepFresh` hooks built from the query, as well as shortcut `Preload`, `Prefetch`, and `KeepFresh` components. Best of all, it uses [`@shopify/react-async`](https://github.com/Shopify/quilt/tree/master/packages/react-async) under the hood, so you get the same server rendering benefits described in that package.

This function takes an options object with a `load` property that returns a promise for a GraphQL query:

```tsx
import {createAsyncQueryComponent} from '@shopify/react-graphql';

const ProductDetailsQuery = createAsyncQueryComponent({
  load: () => import('./graphql/ProductDetailsQuery.graphql'),
});
```

This component can now be used just like a regular `Query` component. It accepts all the same props, except that the query (and associated types) are already embedded in it, so those do not need to be provided.

```tsx
// Assuming the following GraphQL API:
//
// type Shop = {
//   id: String!
//   name: String!
// }

// type Query = {
//   shop: Shop!
// }
//
// and the following query:
//
// query MyQuery {
//   shop { id }
// }

import {createAsyncQueryComponent} from '@shopify/react-graphql';

const MyQuery = createAsyncQueryComponent({
  load: () => import('./graphql/MyQuery.graphql'),
});

// Will complain if you try to pass any variables, because they aren’t needed.
// Will also complain if you try to reference properties on `data` that are not
// available.
<MyQuery>
  {({data}) => {
    return data ? <div>{data.shop.id}</div> : null;
  }}
</MyQuery>;
```

As with components created by `@shopify/react-async`’s `createAsyncComponent()` function, these queries also have static `usePreload`, `usePrefetch`, and `useKeepFresh` hooks, and `Preload`, `Prefetch`, and `KeepFresh` components. "Preload" will simply load the JavaScript bundle associated with the query. "Prefetch" will load the JavaScript bundle **and** load the data (so, if there are any mandatory variables for your query, they will be required when rendering `Prefetch`/ using `usePrefetch`). "KeepFresh" will do the same as "Prefetch", but will also poll for the query.

```tsx
import {usePrefetch} from '@shopify/react-async';
import {createAsyncQueryComponent} from '@shopify/react-graphql';

const MyQuery = createAsyncQueryComponent({
  load: () => import('./graphql/MyQuery.graphql'),
});

// Loads the query script when the browser is idle
<MyQuery.Preload />

// Loads the query script when the browser is idle, and starts polling the query
<MyQuery.KeepFresh pollInterval={20_000} />

// A function that will load the query script and run the query immediately
// when called
const prefetch = usePrefetch(MyQuery);
```

## Using Apollo Hooks

Using Apollo Hooks assume the usage of [`react-apollo`](https://github.com/apollographql/react-apollo))

### `ApolloProvider`

Before using the individual hooks, you will need to wrap your application with `ApolloProvider` at root of your React component tree.

You can it instead of `react-apollo`'s [`ApolloProvider`](https://www.apollographql.com/docs/react/api/react-apollo#ApolloProvider).

```tsx
import React from 'react';
import {render} from 'react-dom';

import ApolloClient from 'apollo-client';
import {ApolloProvider} from '@shopify/react-graphql';

const client = new ApolloClient();

function App() {
  return (
    <ApolloProvider client={client}>
      <MyRootComponent />
    </ApolloProvider>
  );
}

render(<App />, document.getElementById('root'));
```

### `useApolloClient`

`useApolloClient` hook can be use to access apollo client that is currently in the context.
The client returned from hook can than be use to trigger query manually.
Read [ApolloClient class](https://www.apollographql.com/docs/react/api/apollo-client) API for the full list of actions you can perform.

```tsx
import React from 'react';
import gql from 'graphql-tag';
import {useApolloClient} from '@shopify/react-graphql';
import {Button} from '@shopify/polaris';

const petQuery = gql`
  query PetQuery {
    pets {
      name
    }
  }
`;

function MyComponent() {
  const client = useApolloClient();

  async function fetchPets() {
    try {
      await client.query({
        petQuery,
      });
    } catch (error) {
      throw error;
    }
  }

  return <Button onClick={fetchPets}>Fetch Pets</Button>;
}
```

### `useQuery`

This hook accepts two arguments:

- first argument, a required query document or an `AsyncQueryComponent` created from [`createAsyncQueryComponent`](#createasyncquerycomponent)

- second argument, a optional set of options with the following type definition.

```ts
interface QueryHookOptions<Variables = OperationVariables> {
  ssr?: boolean;
  variables?: Variables;
  fetchPolicy?: WatchQueryFetchPolicy;
  errorPolicy?: ErrorPolicy;
  pollInterval?: number;
  client?: ApolloClient<any>;
  notifyOnNetworkStatusChange?: boolean;
  context?: Context;
  skip?: boolean;
}
```

The hook result is an object with the type definition of:

```ts
interface QueryHookResult<Data, Variables> {
  client: ApolloClient<any>;
  data: Data | undefined;
  error?: ApolloError;
  loading: boolean;
  startPolling(pollInterval: number): void;
  stopPolling(): void;
  subscribeToMore<SubscriptionData = Data>(
    options: SubscribeToMoreOptions<Data, Variables, SubscriptionData>,
  ): () => void;
  updateQuery(
    mapFn: (
      previousQueryResult: Data,
      options: UpdateQueryOptions<Variables>,
    ) => Data,
  ): void;
  refetch(variables?: Variables): Promise<ApolloQueryResult<Data>>;
  networkStatus: NetworkStatus | undefined;
  variables: Variables | undefined;
}
```

### `useBackgroundQuery`

This hook is similar to `useQuery`, but instead of executing the query immediately, this hook returns a function that allows you to run the query on-demand at a later time. This makes it well-suited for prefetching a query, when you do not care about the actual result.

```tsx
function MyComponent() {
  const runQuery = useBackgroundQuery(myQuery, {variables: {first: 10}});

  return (
    <button type="button" onTouchStart={runQuery}>
      Load
    </button>
  );
}
```

### Querying with a query document

Below is an example of how to use `useQuery` with a query document.

```tsx
import React from 'react';
import {useQuery} from '@shopify/react-graphql';

import customerListQuery from './graphql/CustomerListQuery.graphql';

function CustomerList() {
  const {data, loading} = useQuery(customerListQuery);
  if (loading) {
    return <div>Loading...</div>;
  }

  const customers = data && data.customers ? data.customers : [];
  return (
    <ul>
      {customers.map(customer => (
        <li key={customer.id}>{customer.displayName}</li>
      ))}
    </ul>
  );
}
```

### Querying with `AsyncQueryComponent`

Below is an example using `useQuery` with an `AsyncQueryComponent` created from [`createAsyncQueryComponent`](#createasyncquerycomponent).

```tsx
import React from 'react';
import {createAsyncQueryComponent, useQuery} from '@shopify/react-graphql';

const CustomerListQuery = createAsyncQueryComponent({
  load: () => import('./graphql/CustomerListQuery.graphql'),
});

function CustomerList() {
  const {data, loading} = useQuery(CustomerListQuery);
  if (loading) {
    return <div>Loading...</div>;
  }

  const customers = data && data.customers ? data.customers : [];
  return (
    <ul>
      {customers.map(customer => (
        <li key={customer.id}>{customer.displayName}</li>
      ))}
    </ul>
  );
}
```

### `useMutation`

This hook accepts two arguments: the mutation document, and optionally, a set of options to pass to the underlying mutation. It will return a function that will trigger the mutation when invoked.

Note the set of options can be pass directly into the hook, or pass in while triggering the mutation function.
If options exist in both places, they will be shallowly merge together with per-mutate options being the priority.

```tsx
import React from 'react';
import {Form, TextField, Button, Banner} from '@shopify/polaris';
import {useMutation} from '@shopify/react-graphql';

import createCustomerMutation from './graphql/CreateCustomerMutation.graphql';

function CustomerDetail() {
  const [name, setName] = React.useState('');
  const createCustomer = useMutation(createCustomerMutation, {
    fetchPolicy: 'network-only',
  });

  async function handleFormSubmit() {
    try {
      await createCustomer({
        variables: {name},
      });

      // do something when the mutation is successful
    } catch (error) {
      // do something when the mutation fails
    }
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <TextField label="Name" value={name} onChange={(value) => {
        setName(value);
      }}>
      <Button submit>
        Create Customer
      </Button>
    </Form>
  );
}
```
