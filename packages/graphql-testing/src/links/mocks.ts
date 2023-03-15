import {ApolloLink, Observable, Operation} from '@apollo/client';
import {ExecutionResult, GraphQLError} from 'graphql';

import {GraphQLMock, MockGraphQLFunction} from '../types';

export class MockLink extends ApolloLink {
  constructor(private mock: GraphQLMock) {
    super();
  }

  updateMock(mock: GraphQLMock) {
    this.mock = mock;
  }

  request(operation: Operation): Observable<any> {
    return new Observable((obs) => {
      const {mock} = this;
      const {operationName = ''} = operation;

      let response: object | null = null;

      if (typeof mock === 'function') {
        response = mock(operation);
      } else {
        const mockForOperation = mock[operationName || ''];

        response =
          typeof mockForOperation === 'function'
            ? (mockForOperation as MockGraphQLFunction)(operation)
            : mockForOperation;
      }

      let result: ExecutionResult | Error;

      if (response == null || typeof response === 'function') {
        let message = `Can’t perform GraphQL operation '${operationName}' because no valid mocks were found`;

        if (typeof mock === 'object') {
          const operationNames = Object.keys(mock);
          const hasOperations = operationNames.length > 0;
          // We will provide a more helpful message when it looks like they just provided data,
          // not an object mapping names to fixtures.
          const looksLikeDataNotFixtures =
            hasOperations &&
            operationNames.every((name) => name === name.toLowerCase());

          if (typeof response === 'function') {
            message +=
              ' (it looks like you tried to provide a function that returned a function, but the mock should be either an object or a function that retuns an object)';
          } else if (looksLikeDataNotFixtures) {
            message += ` (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, change your code to read 'mockGraphQLClient({${operationName}: yourFixture})'`;
          } else if (hasOperations) {
            const operationList = Object.keys(mock).join(', ');
            message += ` (you provided an object that had mocks only for the following operations: ${operationList})`;
          } else {
            message += ` (you provided an empty object that contained no mocks)`;
          }
        } else {
          message +=
            ' (you provided a function that did not return a valid mock result)';
        }

        obs.error(new Error(message));
        return;
      } else if (response instanceof GraphQLError) {
        result = {
          errors: [response],
        };
      } else if (response instanceof Error) {
        result = {errors: [new GraphQLError(response.message)]};
      } else {
        result = {
          data: response,
        };
      }

      obs.next(result);
      obs.complete();
    });
  }
}
