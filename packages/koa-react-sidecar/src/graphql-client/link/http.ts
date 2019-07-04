import {ApolloLink} from 'apollo-link';
import {createHttpLink as createApolloHttpLink} from 'apollo-link-http';
import {Header} from '@shopify/react-network';

export interface Options {
  server?: boolean;
  credentials?: 'include' | 'same-origin';
  accessToken?: string;
  shop?: string;
  host?: string;
  apiEndpointPath?: string;
}

export function createHttpLink({
  credentials = 'include',
  accessToken,
  shop,
  host,
  apiEndpointPath = '/graphql',
}: Options) {
  const httpContextLink = new ApolloLink((operation, nextLink) => {
    if (nextLink == null) {
      throw new Error('The url link must not be a terminating link');
    }

    const headers = {
      [Header.Accept.toLowerCase()]: 'application/json',
      [Header.ContentType.toLowerCase()]: 'application/json',
    };

    if (accessToken) {
      headers['X-Shopify-Access-Token'] = accessToken;
    }

    const url =
      shop && accessToken
        ? new URL(`https://${shop}/admin/api/graphql`)
        : new URL(`https://${host}${apiEndpointPath}`);

    operation.setContext({
      uri: url.toString(),
      credentials,
      headers,
    });

    return nextLink(operation);
  });

  const httpLink = createApolloHttpLink();

  return ApolloLink.from([httpContextLink, httpLink]);
}
