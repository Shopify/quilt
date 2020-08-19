import {ApolloLink, Observable} from 'apollo-link';
import {GraphQLError} from 'graphql';

function errorMessage(serverError: any): string {
  const {response, result} = serverError;
  const errorsFromResult = result && result.errors;

  let message = `${response.url} responded with status ${response.status}`;

  if (errorsFromResult) {
    message = message.concat(` and error message "${errorsFromResult}"`);
  }
  return message;
}

function wrapServerError(serverError: any): GraphQLError {
  return new GraphQLError(
    errorMessage(serverError),
    undefined,
    undefined,
    undefined,
    undefined,
    serverError,
  );
}

export function createErrorHandlerLink() {
  return new ApolloLink((operation, nextLink) => {
    if (nextLink == null) {
      throw new Error('The error handler link must not be a terminating link.');
    }

    return new Observable(observer => {
      const sub = nextLink(operation).subscribe({
        next: observer.next.bind(observer),
        complete: observer.complete.bind(observer),
        error: serverError => {
          if (serverError == null || serverError.response == null) {
            observer.error(serverError);
            return;
          }
          observer.next({
            errors: [wrapServerError(serverError)],
          });
        },
      });
      return () => {
        if (sub) {
          sub.unsubscribe();
        }
      };
    });
  });
}
