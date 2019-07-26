import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {Header} from '@shopify/react-network';
import {ApolloClient} from './client';

export interface Options {
  shop?: string;
  server?: boolean;
  accessToken?: string;
  initialData?: NormalizedCacheObject;
  graphQLEndpoint?: string;
  connectToDevTools?: boolean;
}

export function createGraphQLClient({
  shop,
  server,
  initialData,
  accessToken,
  graphQLEndpoint,
  connectToDevTools,
}: Options) {
  const cache = new InMemoryCache({
    dataIdFromObject: object => object.id,
  });

  const headers = {
    [Header.Accept.toLowerCase()]: 'application/json',
    [Header.ContentType.toLowerCase()]: 'application/json',
  };

  if (accessToken) {
    headers['X-Shopify-Access-Token'] = accessToken;
  }

  const uri = graphQLEndpoint
    ? graphQLEndpoint
    : createGraphQLEndpointForShop(shop, accessToken);

  const link = createHttpLink({
    credentials: 'include',
    uri,
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

function createGraphQLEndpointForShop(shop?: string, accessToken?: string) {
  return shop && accessToken ? `https://${shop}/admin/api/graphql` : '/graphql';
}
