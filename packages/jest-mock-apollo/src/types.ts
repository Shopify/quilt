import {GraphQLRequest} from 'apollo-link';

export type MockGraphQLResponse = Error | object;
export type GraphQLMock =
  | {[key: string]: MockGraphQLResponse}
  | ((request: GraphQLRequest) => MockGraphQLResponse);
