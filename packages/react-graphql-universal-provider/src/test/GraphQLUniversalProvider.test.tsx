import React from 'react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';

import {extract} from '@shopify/react-effect/server';
import {Effect} from '@shopify/react-effect';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {ApolloProvider} from '@shopify/react-graphql';
import {mount} from '@shopify/react-testing';

import {GraphQLUniversalProvider} from '../GraphQLUniversalProvider';

jest.mock('@shopify/react-graphql', () => {
  /* eslint-disable typescript/no-var-requires */
  const ApolloClient = require('apollo-client');
  const InMemoryCache = require('apollo-cache-inmemory');
  const ApolloLink = require('apollo-link');
  /* eslint-enable typescript/no-var-requires */

  return {
    ...require.requireActual('@shopify/react-graphql'),
    createGraphQLClient: jest.fn(
      () =>
        new ApolloClient({cache: new InMemoryCache(), link: new ApolloLink()}),
    ),
  };
});

describe('<GraphQLUniversalProvider />', () => {
  it('renders an ApolloProvider with a client created by the factory', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new ApolloLink(),
    });
    const graphQL = mount(
      <GraphQLUniversalProvider createClient={() => client} />,
    );

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(ApolloClient),
    });
  });

  it('serializes the apollo apollo cache and re-uses it to hydrate the cache', async () => {
    const htmlManager = new HtmlManager();

    const cache = new InMemoryCache();
    const client = new ApolloClient({cache, link: new ApolloLink()});

    // Simulated server render
    await extract(<GraphQLUniversalProvider createClient={() => client} />, {
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
        <GraphQLUniversalProvider createClient={() => client} />
      </HtmlContext.Provider>,
    );

    expect(restoreSpy).toHaveBeenCalledWith(initialData);
  });

  it('renders an <Effect/> from ApolloBridge', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new ApolloLink(),
    });
    const graphQL = mount(
      <GraphQLUniversalProvider createClient={() => client} />,
    );

    expect(graphQL).toContainReactComponent(Effect);
  });
});
