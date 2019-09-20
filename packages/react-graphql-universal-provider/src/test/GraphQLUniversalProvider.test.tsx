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
    const clientOptions = {
      cache: new InMemoryCache(),
      link: new ApolloLink(),
    };
    const graphQL = mount(
      <GraphQLUniversalProvider createClientOptions={() => clientOptions} />,
    );

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(ApolloClient),
    });
  });

  it('renders an <Effect/> from ApolloBridge', () => {
    const clientOptions = {
      cache: new InMemoryCache(),
      link: new ApolloLink(),
    };

    const graphQL = mount(
      <GraphQLUniversalProvider createClientOptions={() => clientOptions} />,
    );

    expect(graphQL).toContainReactComponent(Effect);
  });
});
