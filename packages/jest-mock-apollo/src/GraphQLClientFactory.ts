import {buildSchema, GraphQLSchema} from 'graphql';
import {GraphQLRequest, ApolloLink} from 'apollo-link';
import {
  ApolloReducerConfig,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {GraphQLMock, GraphQLClientConfig, GraphQLClientOptions} from './types';
import MockApolloLink from './MockApolloLink';
import Requests from './Requests';

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

export default class GraphQLClientFactory {
  private unionOrIntersectionTypes: any[];
  private schema: GraphQLSchema;
  private cacheOptions: ApolloReducerConfig;

  constructor({
    unionOrIntersectionTypes = [],
    schema,
    schemaSrc,
    cacheOptions = {},
  }: GraphQLClientConfig) {
    this.unionOrIntersectionTypes = unionOrIntersectionTypes;

    const proposedSchema = schemaSrc == null ? schema : buildSchema(schemaSrc);
    if (proposedSchema == null) {
      throw new Error('schema or schemaSrc is required.');
    }
    this.schema = proposedSchema;

    this.cacheOptions = cacheOptions;

    this.create = this.create.bind(this);
  }

  public create(
    mock: GraphQLMock = defaultGraphQLMock,
    {ssrMode = true}: GraphQLClientOptions = {},
  ) {
    const cache = new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: this.unionOrIntersectionTypes,
          },
        },
      }),
      ...this.cacheOptions,
      // see https://github.com/apollographql/apollo-client/issues/2512
    }) as any;
    const mockLink = new MockApolloLink(mock, this.schema);

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
      link: memoryLink.concat(mockLink),
      cache,
      ssrMode,
    }) as MockGraphQLClient;

    client.graphQLRequests = graphQLRequests;
    client.graphQLResults = graphQLResults;

    return client;
  }
}
