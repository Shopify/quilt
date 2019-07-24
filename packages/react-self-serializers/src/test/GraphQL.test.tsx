import React from 'react';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {
  ApolloProvider,
  ApolloClient,
  createGraphQLClient,
  Options,
} from '@shopify/react-graphql';
import {mount} from '@shopify/react-testing';
import {GraphQL} from '../GraphQL';

jest.mock('@shopify/react-graphql', () => ({
  ...require.requireActual('@shopify/react-graphql'),
  createGraphQLClient: jest.fn(
    () =>
      new ApolloClient({cache: new InMemoryCache(), link: new ApolloLink()}),
  ),
}));

describe('<GraphQL />', () => {
  it('renders an ApolloProvider with a client that was created from the given props', () => {
    const options: Options = {
      shop: 'snow-devil.myshopfiy.com',
      server: true,
      accessToken: '12345',
      graphQLEndpoint: 'http://snow-devil.myshopfiy.com/graphql',
    };

    const graphQL = mount(<GraphQL {...options} />);

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(ApolloClient),
    });

    expect(createGraphQLClient).toHaveBeenCalledWith(options);
  });
});
