import {setContext} from 'apollo-link-context';

export function createRequestIdLink(requestId: string) {
  return setContext((_, {headers}) => ({
    headers: {
      ...headers,
      'X-Request-ID': requestId,
    },
  }));
}
