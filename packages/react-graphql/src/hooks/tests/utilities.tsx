import React from 'react';

import {createGraphQLFactory, GraphQL} from '@shopify/graphql-testing';
import {createMount} from '@shopify/react-testing';

import {ApolloProvider} from '../../ApolloProvider';

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
    const {graphQL} = root.context;

    graphQL.wrap(perform => root.act(perform));

    if (skipInitialGraphQL) {
      return;
    }

    await graphQL.resolveAll();
  },
});

export function createResolvablePromise<T>(value: T) {
  let resolver!: () => Promise<T>;
  let rejecter!: () => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolver = () => {
      resolve(value);
      return promise;
    };
    rejecter = reject;
  });

  return {
    resolve: async () => {
      const value = await resolver();
      // If we just resolve, the tick that actually processes the promise
      // has not finished yet.
      await new Promise(resolve => process.nextTick(resolve));
      return value;
    },
    reject: rejecter,
    promise,
  };
}
