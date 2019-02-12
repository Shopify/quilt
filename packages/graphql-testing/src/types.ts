import {GraphQLRequest, Operation} from 'apollo-link';

export type MockGraphQLResponse = Error | object;
export type MockGraphQLFunction = (
  request: GraphQLRequest,
) => MockGraphQLResponse;
export type GraphQLMock =
  | {[key: string]: MockGraphQLResponse | MockGraphQLFunction}
  | MockGraphQLFunction;

export interface MockRequest {
  operation: Operation;
  resolve(): Promise<void>;
}
