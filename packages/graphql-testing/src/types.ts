import type {DocumentNode, ExecutionResult} from 'graphql';
import type {GraphQLRequest, Operation} from '@apollo/client';

export interface FindOptions {
  query?: DocumentNode | {resolver: {resolved?: DocumentNode}};
  mutation?: DocumentNode;
}

export type MockGraphQLResponse =
  | Error
  | ExecutionResult<{[key: string]: any}>['data'];
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
