import {GraphQLSchema} from 'graphql';
import {GraphQLRequest, ApolloLink} from 'apollo-link';
import {
  ApolloReducerConfig,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

import {GraphQLMock} from './types';
import MockApolloLink from './MockApolloLink';
import Requests from './Requests';

export interface GraphQLClientConfig {
  unionOrIntersectionTypes?: any[];
  schema: GraphQLSchema;
  cacheOptions?: ApolloReducerConfig;
}

export type MockGraphQLClient = ApolloClient<any> & {
  graphQLRequests: Requests;
  graphQLResults: Promise<any>[];
};

function defaultGraphQLMock({operationName}: GraphQLRequest) {
  return new Error(
    `Can’t perform GraphQL operation '${operationName ||
      ''}' because no mocks were set.`,
  );
}

export default function configureClient({
  unionOrIntersectionTypes = [],
  schema,
  cacheOptions = {},
}: GraphQLClientConfig) {
  return function createGraphQLClient(mock: GraphQLMock = defaultGraphQLMock) {
    const cache = new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: unionOrIntersectionTypes,
          },
        },
      }),
      ...cacheOptions,
      // see https://github.com/apollographql/apollo-client/issues/2512
    }) as any;
    const mockLink = new MockApolloLink(mock, schema);

    const graphQLRequests = new Requests();
    const graphQLResults: Promise<any>[] = [];
    const memoryLink = new ApolloLink((operation, forward) => {
      if (forward == null) {
        return null;
      }
      graphQLRequests.push(operation);
      let resolver: Function;
      graphQLResults.push(
        new Promise(resolve => {
          resolver = resolve;
        }),
      );
      const observer = forward(operation);
      observer.subscribe(next => resolver(next), err => resolver(err));
      return observer;
    });

    const client = new ApolloClient({
      // @ts-ignore
      link: memoryLink.concat(mockLink),
      cache,
    }) as MockGraphQLClient;

    client.graphQLRequests = graphQLRequests;
    client.graphQLResults = graphQLResults;

    return client;
  };
}
