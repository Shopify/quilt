import {setContext} from '@apollo/client/link/context';

export function createRequestIdLink(requestId: string) {
  return setContext((_, {headers}) => ({
    headers: {
      ...headers,
      'X-Initiated-By-Request-ID': requestId,
    },
  }));
}
