import {ApolloLink} from 'apollo-link';

import {createHttpLink, Options as HttpLinkOptions} from './http';

export type Options = HttpLinkOptions;

export function createApolloLink({
  host,
  apiEndpointPath,
  server,
  credentials,
  accessToken,
  shop,
}: Options) {
  return ApolloLink.from([
    createHttpLink({
      shop,
      host,
      apiEndpointPath,
      server,
      credentials,
      accessToken,
    }),
  ]);
}
