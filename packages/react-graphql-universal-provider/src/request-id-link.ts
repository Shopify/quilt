import {setContext} from '@apollo/client/link/context';

export function createRequestIdLink(requestId: string) {
  return setContext((_, {headers}) => ({
    headers: {
      ...headers,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Initiated-By-Request-ID': requestId,
    },
  }));
}
