import * as React from 'react';

import {createGraphQLFactory, GraphQL} from '@shopify/graphql-testing';
import {createMount} from '@shopify/react-testing';
import {promise} from '@shopify/jest-dom-mocks';

import {ApolloProvider} from '../ApolloProvider';

const createGraphQL = createGraphQLFactory();

interface Options {
  graphQL?: GraphQL;
  skipInitialGraphQL?: boolean;
}

interface Context {
  graphQL: GraphQL;
}

export const mountWithGraphQL = createMount<Options, Context, true>({
  context({graphQL = createGraphQL()}) {
    return {graphQL};
  },

  render(element, {graphQL}) {
    return <ApolloProvider client={graphQL.client}>{element}</ApolloProvider>;
  },
  async afterMount(root, {skipInitialGraphQL}) {
    root.context.graphQL.on('pre-resolve', () => {
      root.act(runPendingAsyncReactTasks);
    });

    if (skipInitialGraphQL) {
      return;
    }

    await root.context.graphQL.resolveAll();
  },
});

export function prepareAsyncReactTasks() {
  if (!promise.isMocked()) {
    promise.mock();
  }
}

export function teardownAsyncReactTasks() {
  if (promise.isMocked()) {
    promise.restore();
  }
}

export function runPendingAsyncReactTasks() {
  if (!promise.isMocked()) {
    throw new Error(
      'You attempted to resolve pending async React tasks, but have not yet prepared to do so. Run `prepareAsyncReactTasks()` from "tests/modern" in a `beforeEach` block and try again.',
    );
  }

  promise.runPending();
}
