import React from 'react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {extract} from '@shopify/react-effect/server';

import {HtmlManager, HtmlContext} from '@shopify/react-html';

import {ApolloProvider} from '@shopify/react-graphql';
import {mount} from '@shopify/react-testing';
import {GraphQL} from '../GraphQLComponent';

jest.mock('@shopify/react-graphql', () => ({
  ...require.requireActual('@shopify/react-graphql'),
  createGraphQLClient: jest.fn(
    () =>
      new ApolloClient({cache: new InMemoryCache(), link: new ApolloLink()}),
  ),
}));

describe('<GraphQL />', () => {
  it('renders an ApolloProvider with a client created by the factory', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new ApolloLink(),
    });
    const graphQL = mount(<GraphQL createClient={() => client} />);

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(ApolloClient),
    });
  });

  it('serializes the apollo apollo cache and re-uses it to hydrate the cache', async () => {
    const htmlManager = new HtmlManager();

    const cache = new InMemoryCache();
    const client = new ApolloClient({cache, link: new ApolloLink()});

    // Simulated server render
    await extract(<GraphQL createClient={() => client} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const initialData = client.extract();
    const restoreSpy = jest.spyOn(cache, 'restore');

    // Simulated client render (note: same htmlManager, which replaces the way the
    // client would typically read serializations from the DOM on initialization).
    mount(
      <HtmlContext.Provider value={htmlManager}>
        <GraphQL createClient={() => client} />
      </HtmlContext.Provider>,
    );

    expect(restoreSpy).toHaveBeenCalledWith(initialData);
  });
});
