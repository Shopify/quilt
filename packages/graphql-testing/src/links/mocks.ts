import {ApolloLink, Observable, Operation, FetchResult} from 'apollo-link';
import {GraphQLError} from 'graphql';
import {GraphQLMock, MockGraphQLFunction} from '../types';

export class MockLink extends ApolloLink {
  constructor(private mock: GraphQLMock) {
    super();
  }

  request(operation: Operation): Observable<FetchResult> | null {
    return new Observable(obs => {
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

      if (response == null) {
        let message = `Can’t perform GraphQL operation '${operationName}' because no valid mocks were found`;

        if (typeof mock === 'object') {
          const operationNames = Object.keys(mock);
          // We will provide a more helpful message when it looks like they just provided data,
          // not an object mapping names to fixtures.
          const looksLikeDataNotFixtures = operationNames.every(
            name => name === name.toLowerCase(),
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

        obs.error(new Error(message));
      } else if (
        response instanceof GraphQLError ||
        response instanceof Error
      ) {
        obs.error(response);
      } else {
        obs.next({
          data: response,
        });
        obs.complete();
      }
    });
  }
}
