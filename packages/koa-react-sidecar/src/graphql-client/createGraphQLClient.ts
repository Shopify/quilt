import {ApolloClient} from 'apollo-client';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {createApolloLink, Options} from './link';

export type GraphQLClientOptions = Options & {
  initialData?: NormalizedCacheObject;
};

export function createGraphQLClient({
  server,
  accessToken,
  initialData,
  ...options
}: GraphQLClientOptions) {
  const link = createApolloLink({accessToken, ...options});
  const cache = new InMemoryCache({
    dataIdFromObject: object => object.id,
  });

  return new ApolloClient({
    assumeImmutableResults: true,
    ssrMode: server,
    ssrForceFetchDelay: 100,
    link,
    cache: initialData ? cache.restore(initialData) : cache,
  });
}
