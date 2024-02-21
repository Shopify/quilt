import type {DocumentNode} from 'graphql';
import type {GraphQLRequest, Operation} from '@apollo/client';

export interface FindOptions {
  query?: DocumentNode | {resolver: {resolved?: DocumentNode}};
  mutation?: DocumentNode;
}

export type MockGraphQLResponse = Error | object;
export type MockGraphQLFunction = (
  request: GraphQLRequest,
) => MockGraphQLResponse;

export type MockGraphQLObject = {
  [key: string]: MockGraphQLResponse | MockGraphQLFunction;
};

export type GraphQLMock = MockGraphQLObject | MockGraphQLFunction;

export interface MockRequest {
  operation: Operation;
  resolve(): Promise<void>;
}
