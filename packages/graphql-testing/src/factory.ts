import type {Options} from './graphql-controller';
import {GraphQL} from './graphql-controller';
import type {GraphQLMock} from './types';

export function createGraphQLFactory(options?: Options) {
  return function createGraphQL(mock?: GraphQLMock) {
    return new GraphQL(mock, options);
  };
}
