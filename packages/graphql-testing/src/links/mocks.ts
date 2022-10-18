import {
  MockedResponse,
  MockLink as ApolloMockLink,
} from '@apollo/client/testing';
import {Operation, FetchResult} from '@apollo/client/core';
import {Observable} from '@apollo/client/utilities';
import {GraphQLError} from 'graphql';

import {GraphQLMock} from '../types';

export class MockLink extends ApolloMockLink {
  #mock: GraphQLMock;

  constructor(mock: GraphQLMock) {
    super([], true);
    this.#mock = mock;
  }

  updateMock(mock: GraphQLMock) {
    this.#mock = mock;
  }

  request(operation: Operation): Observable<FetchResult> | null {
    const mock = this.#mock;
    const operationName = operation.operationName ?? '';

    const mockReponse: MockedResponse = {
      request: {
        query: operation.query,
        variables: operation.variables,
      },
    };

    let response: MockedResponse['result'] | null = null;

    if (typeof mock === 'function') {
      try {
        response = mock(operation);
      } catch (err) {
        response = new Error('efef');
      }
    } else {
      const mockForOperation = mock[operationName || ''];

      response =
        typeof mockForOperation === 'function'
          ? mockFunctiontoApolloResponseResult(mockForOperation, operation)
          : mockForOperation;
    }

    if (response == null) {
      let message = `Can’t perform GraphQL operation '${operationName}' because no valid mocks were found`;

      if (typeof mock === 'object') {
        const operationNames = Object.keys(mock);
        // We will provide a more helpful message when it looks like they just provided data,
        // not an object mapping names to fixtures.
        const looksLikeDataNotFixtures = operationNames.every(
          (name) => name === name.toLowerCase(),
        );

        message += looksLikeDataNotFixtures
          ? ` (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, simply change your code to read 'mockGraphQLClient({${operationName}: yourFixture}).'`
          : ` (you provided an object that had mocks only for the following operations: ${Object.keys(
              mock,
            ).join(', ')}).`;
      } else {
        message +=
          ' (you provided a function that did not return a valid mock result)';
      }

      mockReponse.error = new Error(message);
    } else if (response instanceof GraphQLError) {
      mockReponse.result = {errors: [response]};
    } else if (response instanceof Error) {
      mockReponse.result = {errors: [new GraphQLError(response.message)]};
    } else {
      mockReponse.result = {data: response};
    }

    this.addMockedResponse(mockReponse);

    return super.request(operation);
  }
}

function mockFunctiontoApolloResponseResult<TArgs, TResult>(
  funct: (...TArgs) => TResult,
  args: TArgs,
): TResult | (() => TResult) {
  try {
    const result = funct(args);
    return result;
  } catch (err) {
    return () => {
      throw err;
    };
  }
}
