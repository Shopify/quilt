import React from 'react';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {extract} from '@shopify/react-effect/server';

import {HtmlManager, HtmlContext} from '@shopify/react-html';

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
  const options: Options = {
    shop: 'snow-devil.myshopfiy.com',
    server: true,
    accessToken: '12345',
    graphQLEndpoint: 'http://snow-devil.myshopfiy.com/graphql',
    initialData: {foo: {foo: 'bar'}},
  };

  it('renders an ApolloProvider with a client that was created from the given props', () => {
    const graphQL = mount(<GraphQL {...options} />);

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(ApolloClient),
    });
  });

  it('serializes i18n details and reuses them', async () => {
    const htmlManager = new HtmlManager();

    await extract(<GraphQL {...options} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const graphQL = mount(<GraphQL />);

    expect(createGraphQLClient).toHaveBeenCalledWith(options);

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(ApolloClient),
    });
  });
});
