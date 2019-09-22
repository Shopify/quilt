import {GraphQL, Options} from './graphql-controller';
import {GraphQLMock} from './types';

export function createGraphQLFactory(options?: Options) {
  return function createGraphQL(mock?: GraphQLMock) {
    return new GraphQL(mock, options);
  };
}
