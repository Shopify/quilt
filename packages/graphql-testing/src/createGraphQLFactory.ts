import {GraphQLRequest} from 'apollo-link';
import {
  ApolloReducerConfig,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {ApolloClientOptions} from 'apollo-client';

import MemoryApolloClient from './MemoryApolloClient';
import MockApolloLink from './MockApolloLink';
import Operations from './Operations';
import {GraphQLMock} from './types';

export interface Options {
  unionOrIntersectionTypes?: any[];
  cacheOptions?: ApolloReducerConfig;
}

function defaultGraphQLMock({operationName}: GraphQLRequest) {
  return new Error(
    `Can’t perform GraphQL operation '${operationName ||
      ''}' because no mocks were set.`,
  );
}

class GraphQL {
  client: MemoryApolloClient;
  readonly operations: Operations;
  private afterResolver: (() => void) | undefined;

  constructor(
    mock: GraphQLMock,
    {unionOrIntersectionTypes = [], cacheOptions = {}}: Options = {},
  ) {
    const cache = new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: unionOrIntersectionTypes,
          },
        },
      }),
      ...cacheOptions,
    });

    const mockApolloClientOptions: ApolloClientOptions<unknown> = {
      link: new MockApolloLink(mock),
      cache,
    };

    const memoryApolloClient = new MemoryApolloClient(mockApolloClientOptions);

    this.client = memoryApolloClient;
    this.operations = memoryApolloClient.operations;
  }

  afterResolve(resolver: () => void) {
    this.afterResolver = resolver;
  }

  async resolveAll() {
    await this.client.resolveAll();

    if (this.afterResolver) {
      this.afterResolver();
    }
  }
}

export default function createGraphQLFactory(options?: Options) {
  return function createGraphQLClient(mock: GraphQLMock = defaultGraphQLMock) {
    return new GraphQL(mock, options);
  };
}
