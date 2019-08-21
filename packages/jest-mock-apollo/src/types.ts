import {GraphQLRequest} from 'apollo-link';

export type MockGraphQLResponse = Error | object;
export type MockGraphQLFunction = (
  request: GraphQLRequest,
) => MockGraphQLResponse;
export type GraphQLMock =
  | {[key: string]: MockGraphQLResponse | MockGraphQLFunction}
  | MockGraphQLFunction;
