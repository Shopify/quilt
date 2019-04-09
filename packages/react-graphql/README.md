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

The `createAsyncQueryComponent` function is an equally strong-typed alternative to `Query` that supports asynchronously-loading GraphQL queries. The resulting component also exposes useful `Preload`, `Prefetch`, and `KeepFresh` components built from the query. Best of all, it uses [`@shopify/react-async`](https://github.com/Shopify/quilt/tree/master/packages/react-async) under the hood, so you get the same server rendering benefits described in that package.

This function takes an options object with a `load` property that returns a promise for a GraphQL query:

```tsx
import {createAsyncQueryComponent} from '@shopify/react-graphql';

const ProductDetailsQuery = createAsyncQueryComponent({
  load: () => import('./graphql/ProductDetailsQuery.graphql'),
});
```

As with `@shopify/react-async`, you can also pass a `defer` prop that is a member of the `DeferTiming` enum to force the GraphQL query to resolve later on in its lifecycle:

```tsx
import {createAsyncQueryComponent, DeferTiming} from '@shopify/react-graphql';

const ProductDetailsQuery = createAsyncQueryComponent({
  load: () => import('./graphql/ProductDetailsQuery.graphql'),
  defer: DeferTiming.Idle,
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

As with components created by `@shopify/react-async`’s `createAsyncComponent()` function, these queries also have static `Preload`, `Prefetch`, and `KeepFresh` components. `Preload` will simply load the JavaScript bundle associated with the query. `Prefetch` will load the JavaScript bundle **and** load the data (so, if there are any mandatory variables for your query, they will be required when rendering `Prefetch`). `KeepFresh` will do the same as `Prefetch`, but will also poll for the query (you can customize the interval with the `pollInterval` prop).

```tsx
const MyQuery = createAsyncQueryComponent({
  load: () => import('./graphql/MyQuery.graphql'),
});

<MyQuery.Preload />
<MyQuery.Prefetch />
<MyQuery.KeepFresh pollInterval={20_000} />
```

All components created by this library also reserve an `async` prop (that is, you can’t have any props on these components also named `async`). This prop can be used to pass custom instructions to the underlying async loading component.

Currently, this prop is an object with a `defer?: DeferTiming` property, which changes the default `defer` behaviour of the component (by default, the `Query`/ "root" component is not deferred, `Preload` and `KeepFresh` are deferred until idle, and `Prefetch` is deferred until mount).

```tsx
const MyQuery = createAsyncQueryComponent({
  load: () => import('./graphql/MyQuery.graphql'),
});

<MyQuery async={{defer: DeferTiming.Mount}} />

// This will force all of these components not to be deferred at all
<MyQuery.Preload async={{defer: undefined}} />
<MyQuery.Prefetch async={{defer: undefined}} />
<MyQuery.KeepFresh pollInterval={20_000} async={{defer: undefined}} />
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
import {ApolloProvider} from 'react-graphql';

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

### `useQuery`

Here is an example of how to use `useQuery` with a query document.

```tsx
import React from 'react';
import {useQuery} from '@shopify/react-graphql';

import customerListQuery from './graphql/CustomerListQuery.graphql';

function CustomerList() {
  const {data, loading, refetch} = useQuery(customerListQuery);
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
    <button onClick={async () => {
        await refetch();
    }}>Refetch Customers Data</button>
  );
}
```

You can also use `useQuery` with an async query component created from `@shopify/react-graphql`

Note that because the `.graphql` document is being asynchronously loaded, `refetch` and other helper methods may not be available until the query document is loaded.

```tsx
import React from 'react';
import {createAsyncQueryComponent, useQuery} from '@shopify/react-graphql';

const CustomerListQuery = createAsyncQueryComponent({
  load: () => import('./graphql/CustomerListQuery.graphql'),
});

function CustomerList() {
  const {data, loading, refetch} = useQuery(CustomerListQuery);
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
    <button onClick={async () => {
        if (!refetch) {
            return;
        }
        await refetch();
    }}>Refetch Customers Data</button>
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
import {useQuery} from '@shopify/react-graphql';

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
    <Form onSubmit={handleCreateCustomer}>
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
