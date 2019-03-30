# `@shopify/graphql-testing`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fgraphql-testing.svg)](https://badge.fury.io/js/%40shopify%2Fgraphql-testing.svg)

This package provides utilities to help in the following testing scenarios:

1. Testing a graphQL operation with mock data.
2. Testing the state of your application before/after all the graphQL operations resolve.

## Installation

```bash
$ yarn add @shopify/graphql-testing
```

## Usage

The default utility exported by this library is `createGraphQLFactory`.

```js
const createGraphQL = createGraphQLFactory();
```

This factory function can then be use to creating a mock `ApolloClient` that you will pass into your test setup with the desire mock data.

```js
const graphQL = createGraphQL(mockData);
const apolloClient = graphQL.client;
```

By default, this mock client will hold all the graphQL operations triggered by your application in a pending state.

To resolve all pending graphQL operations:

```js
await graphQL.resolveAll();
```

You can also access all the graphQL operations triggered by your application (pending and non-pending) using:

```js
graphQL.operations.all();
```

and only those graphQL operations with specific name using:

```js
graphQL.operations.all({operationName: 'Pet'});
```

### Examples

Below is an example of how to use `createGraphQLFactory` in a React component test.

Note: In a typical application you will want to generalized some of this implementation (ie. mouting of `ApolloProvider`) for repeated use.

```ts
import {mount} from 'enzyme';
import {ApolloProvider} from 'react-apollo';
import {createGraphQLFactory} from '@shopify/graphql-testing';

export const createGraphQL = createGraphQLFactory();

it('loads mock data from GraphQL', async () => {
  const mockCustomerData = {firstName: 'Jane', lastName: 'Doe'};
  const graphQL = createGraphQL({
    CustomerDetails: {
      customer: mockCustomerData,
    },
  });

  const customerDetails = mount(
    <ApolloProvider client={graphQL.client}>
      <CustomerDetails id="123" />
    </ApolloProvider>,
  );

  expect(customerDetails.find(TextField)).toHaveProp('value', '');

  await graphQL.resolveAll();
  customerDetails.update();

  expect(customerDetails.find(TextField)).toHaveProp(
    'value',
    mockCustomerData.firstName,
  );
});
```

Below is an example of how to assert that a graphQL request was triggered.

```ts
import {mount} from 'enzyme';
import {ApolloProvider} from 'react-apollo';
import {trigger} from '@shopify/enzyme-utilities';
import {createGraphQLFactory} from '@shopify/graphql-testing';

export const createGraphQL = createGraphQLFactory();

it('triggers a graphQL request when the load data button is clicked', async () => {
  const mockCustomerData = {firstName: 'Jane', lastName: 'Doe'};
  const graphQL = createGraphQL({
    CustomerDetails: {
      customer: mockCustomerData,
    },
  });

  const customerDetails = mount(
    <ApolloProvider client={graphQL.client}>
      <CustomerDetails id="123" />
    </ApolloProvider>,
  );

  expect(graphQL.operations.all()).toHaveLength(0);

  trigger(customerDetails.find(LoadDataButton), 'onClick');

  expect(graphQL.operations.all()).toHaveLength(1);
  expect(graphQL.operations.last().operationName).toEqual('CustomerDetails');
});
```
