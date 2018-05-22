import {GraphQLRequest} from 'apollo-link';
import {GraphQLSchema} from 'graphql';
import {ApolloReducerConfig} from 'apollo-cache-inmemory';

export type MockGraphQLResponse = Error | object;
export type GraphQLMock =
  | {[key: string]: MockGraphQLResponse}
  | ((request: GraphQLRequest) => MockGraphQLResponse);

export interface GraphQLClientConfig {
  unionOrIntersectionTypes?: any[];
  schema?: GraphQLSchema;
  schemaSrc?: string;
  cacheOptions?: ApolloReducerConfig;
}

export interface GraphQLClientOptions {
  ssrMode?: boolean;
}
