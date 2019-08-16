import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {Header} from '@shopify/react-network';
import {ApolloClient} from './client';

export interface Options {
  server?: boolean;
  initialData?: NormalizedCacheObject;
  graphQLEndpoint?: string;
  connectToDevTools?: boolean;
}

export function createGraphQLClient({
  server,
  initialData,
  graphQLEndpoint = '/graphql',
  connectToDevTools,
}: Options) {
  const cache = new InMemoryCache({
    dataIdFromObject: object => object.id,
  });

  const headers = {
    [Header.Accept.toLowerCase()]: 'application/json',
    [Header.ContentType.toLowerCase()]: 'application/json',
  };

  const link = createHttpLink({
    credentials: 'include',
    uri: graphQLEndpoint,
    headers,
  });

  return new ApolloClient({
    link,
    ssrMode: server,
    ssrForceFetchDelay: 100,
    cache: initialData ? cache.restore(initialData) : cache,
    connectToDevTools: !server && connectToDevTools,
  });
}
