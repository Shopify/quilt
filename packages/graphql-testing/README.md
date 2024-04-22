# `@shopify/graphql-testing`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fgraphql-testing.svg)](https://badge.fury.io/js/%40shopify%2Fgraphql-testing.svg)

This package provides utilities to help in the following testing scenarios:

1. Testing a GraphQL operation with mock data
2. Testing the state of your application before/after all the GraphQL operations resolve

## Installation

```bash
yarn add @shopify/graphql-testing
```

## Usage

The default utility exported by this library is `createGraphQLFactory`. This factory accepts an optional options argument that allows you to pass a `cacheOptions` that will be used to construct an Apollo in-memory cache and/ or `links` which can contain `ApolloLink`s that will be passed to the apollo client links.

```js
const createGraphQL = createGraphQLFactory({
  cacheOptions: {
    possibleTypes: {},
  },
});
```

The resulting function can be used to create a GraphQL controller that tracks and resolves GraphQL operations according to the mocks you supply. The mock you provide should be an object where the keys are operation names, and the values are either an object to return as data for that operation, or a function that takes a `GraphQLRequest` and returns suitable data. Alternatively, the mock can be a function that accepts a `GraphQLRequest` and returns suitable mock data.

```js
const graphQL = createGraphQL({
  Pet: ({variables: {id}}) => ({pet: {id, name: 'Garfield'}}),
  Pets: () => ({pets: []}),
});
```

The call to the function returned by `createGraphQLFactory` (`createGraphQL` in the example above) creates a `GraphQL` instance, which is described in detail below.

### `GraphQL`

The following method and properties are available on the `GraphQL` object:

#### `resolveNext()`

_Note:_ Prefer `graphQL.resolveAll()` over this for almost all use cases.

By default, the mock client will hold all the graphQL operations triggered by your application in a pending state. To resolve all pending graphQL operations, call `graphQL.resolveAll()`, which returns a promise that resolves once all the operations have completed.

```js
await graphQL.resolveNext();
```

You can also pass a `query`, `mutation` or `filter` option to `resolveNext`. `query` and `mutation` will filter the pending operations and only resolve the ones with a matching operation. `filter` allows you to write your own custom filter function based upon the operation, for instace this will allow you to filter by the variables passed to the query. If `filter` is passed in addition to `query` or `mutation` then both filters shall be applied.

```js
await graphQL.resolveNext({query: petQuery});
```

```js
await graphQL.resolveNext({
  query: petQuery,
  filter: (operation) => operation.variables.id === '1',
});
```

Note that, until a GraphQL operation has been resolved, it does not appear in the `operations` list described below.

#### `resolveAll()`

Similar to `resolveNext()`, but this will wait for any newly created GraphQL operations to finish. This is useful in the cases that one graphql call is loaded, which kicks off another GraphQL query/mutation.

The signature for `resolveAll` is identical to the signature for `resolveNext`.

```js
await graphQL.resolveAll();
```

#### `waitForQueryUpdates()`

Apollo 3.6.0+ batches updates to the cache asynchronously. This means that in cases where you trigger fetching more data using `fetchMore` often the cache is persisted in the next tick and thus the component making the query does not update in the expected act block. This can result in flaky tests where you request data, and use resolveAll to fetch it, but the React component under test does not update.

The `waitForQueryUpdates()` method shall ensure all cache updates are resolved.

#### `wrap()`

The `wrap()` method allows you to wrap all calls to `resolveAll()` and `waitForQueryUpdates()` in a function call. This can be useful when working with React components, which require that all operations that lead to state changes be wrapped in an `act()` call. The following example demonstrates using this with [`@shopify/react-testing`](../react-testing):

```tsx
const myComponent = mount(<MyComponent />);
const graphQL = createGraphQL(mocks);

graphQL.wrap((resolve) => myComponent.act(resolve));

// Before, calling this could cause warnings about state updates happening outside
// of act(). Now, all GraphQL resolutions are safely wrapped in myComponent.act().
await graphQL.resolveAll();
```

#### `update()`

The `update()` method updates mocks after they have been initialized:

```tsx
const myComponent = mount(<MyComponent />);
const newName = 'Garfield2';
const graphQL = createGraphQL({
  Pet: {
    pet: {
      __typename: 'Cat',
      name: 'Garfield',
    },
  },
});

graphQL.wrap((resolve) => myComponent.act(resolve));
await graphQL.resolveAll();

graphQL.update({
  Pet: {
    pet: {
      __typename: 'Cat',
      name: newName,
    },
  },
});

const click = myComponent.find('button').trigger('onClick');
await graphQL.resolveAll();
await click;

expect(myComponent).toContainReactText(newName);
```

#### `#operations`

`graphQL.operations` is a custom data structure that tracks all **resolved** GraphQL operations that the GraphQL controller has performed. This object has `first()`, `last()`, `all()`, and `nth()` methods, which allow you to inspect individual operations. All of these methods also accept an optional options argument, which allows you to narrow down the operations to specific queries or mutations:

```tsx
const graphQL = createGraphQL(mocks);

// the very first operation, or undefined if no operations have been performed
graphQL.operations.first();

// the second last operation run with petQuery
graphQL.operations.nth(-2, {query: petQuery});

// the last operation of any kind
graphQL.operations.last();

// all mutations with this mutation
graphQL.operations.all({mutation: addPetMutation});
```

The `query` and `mutation` options both accept either a regular `DocumentNode`, or an async GraphQL component created with [`@shopify/react-graphql`’s `createAsyncQueryComponent` function](../react-graphql).

### Errors

You can use `createGraphQL` to test error states.

#### Network Errors

You can test network errors by throwing an `Error`.

```tsx
const graphQL = createGraphQL({
  Pet: () => {
    throw new Error('Network Error');
  },
});
```

#### GraphQL Errors

You can test the graphql api returning an error state by returning an `Error` or `GraphQLError`.

```tsx
const graphQL = createGraphQL({
  Pet: new Error('Error message'),
});
```

```tsx
import {GraphQLError} from 'graphql';
const graphQL = createGraphQL({
  Pet: new GraphQLError('Error message'),
});
```

### Matchers

This library provides a [Jest matcher](https://jestjs.io/docs/en/using-matchers). To use this matcher, you’ll need to include `@shopify/graphql-testing/matchers` in your Jest setup file. The following matcher will then be available:

#### `toHavePerformedGraphQLOperation(operation: GraphQLOperation, variables?: object)`

This assertion should be run on a `GraphQL` object. It verifies that at least one operation matching the one you passed (either a `DocumentNode` or an async query component from `@shopify/react-graphql`) was completed. If you pass variables, this assertion will also ensure that at least one operation had matching variables. You only need to provide a subset of all variables, and the assertion argument can use any of Jest’s asymmetric matchers.

```tsx
const graphQL = createGraphQL(mocks);

// perform something...

expect(graphQL).toHavePerformedGraphQLOperation(myQuery);
expect(graphQL).toHavePerformedGraphQLOperation(MyQueryComponent, {
  id: '123',
  first: expect.any(Number),
});
```
