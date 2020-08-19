import {ApolloLink} from 'apollo-link';
import {ErrorLink} from 'apollo-link-error';
import {ServerParseError} from 'apollo-link-http-common';

export function createNetworkErrorLink() {
  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'development') {
    return new ErrorLink(({networkError}) => {
      if (networkError && networkError.name === 'ServerParseError') {
        networkError.message = (networkError as ServerParseError).bodyText;
      }
    });
  } else {
    return new ApolloLink((operation, nextLink) => {
      if (nextLink == null) {
        throw new Error('The parse error link must not be a terminating link');
      }
      return nextLink(operation);
    });
  }
}
