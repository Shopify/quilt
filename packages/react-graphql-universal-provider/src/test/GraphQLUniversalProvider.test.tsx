import React from 'react';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {extract} from '@shopify/react-effect/server';
import {mount} from '@shopify/react-testing';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {ApolloProvider} from '@shopify/react-graphql';
import {NetworkContext, NetworkManager} from '@shopify/react-network';

import {GraphQLUniversalProvider} from '../GraphQLUniversalProvider';

jest.mock('apollo-client', () => {
  const ApolloClient = require.requireActual('apollo-client').ApolloClient;
  const mockApolloClient = jest.fn(options => new ApolloClient(options));

  return {
    ...require.requireActual('apollo-client'),
    default: mockApolloClient,
    ApolloClient: mockApolloClient,
  };
});

jest.mock('../utilities', () => ({
  ...require.requireActual('../utilities'),
  isServer: jest.fn(),
}));
const {isServer} = require.requireMock('../utilities');

jest.mock('../request-id-link', () => ({
  ...require.requireActual('../request-id-link'),
  createRequestIdLink: jest.fn(),
}));
const {createRequestIdLink} = require.requireMock('../request-id-link');

const ApolloClient = require.requireMock('apollo-client').default;

describe('<GraphQLUniversalProvider />', () => {
  beforeEach(() => {
    isServer.mockClear();
    isServer.mockImplementation(() => true);

    ApolloClient.mockClear();
    createRequestIdLink.mockClear();
  });

  it('renders an ApolloProvider with a client created by the factory', () => {
    const graphQL = mount(
      <NetworkContext.Provider value={new NetworkManager()}>
        <GraphQLUniversalProvider createClientOptions={() => ({})} />
      </NetworkContext.Provider>,
    );

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(require.requireActual('apollo-client').ApolloClient),
    });
  });

  it('includes a link if none are given', () => {
    const graphQL = mount(
      <NetworkContext.Provider value={new NetworkManager()}>
        <GraphQLUniversalProvider createClientOptions={() => ({})} />
      </NetworkContext.Provider>,
    );

    expect(ApolloClient).toHaveBeenLastCalledWith(
      expect.objectContaining({link: expect.any(ApolloLink)}),
    );
  });

  describe('cache', () => {
    it('includes a InMemoryCache as cache when none is given in clientOptions', () => {
      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({cache: expect.any(InMemoryCache)}),
      );
    });

    it('includes the given cache from clientOptions', () => {
      const cache = new InMemoryCache({addTypename: true});

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({cache})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({cache}),
      );
    });

    it('serializes the apollo cache and re-uses it to hydrate the cache', async () => {
      const htmlManager = new HtmlManager();

      const cache = new InMemoryCache();

      const graphQLProvider = (
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider
            createClientOptions={() => ({cache, link: new ApolloLink()})}
          />
        </NetworkContext.Provider>
      );

      const client = mount(graphQLProvider)
        .find(ApolloProvider)!
        .prop('client');

      // Simulated server render
      await extract(graphQLProvider, {
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
          {graphQLProvider}
        </HtmlContext.Provider>,
      );

      expect(restoreSpy).toHaveBeenCalledWith(initialData);
    });
  });

  describe('ssrMode', () => {
    it('ssrMode is set to true when it is on the server', () => {
      isServer.mockReturnValue(true);

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({ssrMode: true}),
      );
    });

    it('ssrMode is set to false when it is on the client', () => {
      isServer.mockReturnValue(false);

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({ssrMode: false}),
      );
    });

    it('ssrMode is set to the value returend in createClientOptions', () => {
      isServer.mockReturnValue(true);

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider
            createClientOptions={() => ({ssrMode: false})}
          />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({ssrMode: false}),
      );
    });
  });

  describe('ssrForceFetchDelay', () => {
    it('ssrForceFetchDelay is set to 100 by default', () => {
      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({ssrForceFetchDelay: 100}),
      );
    });

    it('ssrForceFetchDelay is set to the value returend in createClientOptions', () => {
      const mockSsrForceFetchDelay = 500;
      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider
            createClientOptions={() => ({
              ssrForceFetchDelay: mockSsrForceFetchDelay,
            })}
          />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({ssrForceFetchDelay: mockSsrForceFetchDelay}),
      );
    });
  });

  describe('connectToDevTools', () => {
    it('connectToDevTools is set to false when it is on the server', () => {
      isServer.mockReturnValue(true);

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({connectToDevTools: false}),
      );
    });

    it('connectToDevTools is set to true when it is on the client', () => {
      isServer.mockReturnValue(false);

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({connectToDevTools: true}),
      );
    });

    it('connectToDevTools is set to the value returend in createClientOptions', () => {
      isServer.mockReturnValue(true);

      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider
            createClientOptions={() => ({connectToDevTools: true})}
          />
        </NetworkContext.Provider>,
      );

      expect(ApolloClient).toHaveBeenLastCalledWith(
        expect.objectContaining({connectToDevTools: true}),
      );
    });
  });

  describe('requestIdLink', () => {
    it('calls createRequestIdLink if RequestId header has value', () => {
      const mockRequestId = 'request-id-value';

      const graphQL = mount(
        <NetworkContext.Provider
          value={new NetworkManager({headers: {'X-Request-ID': mockRequestId}})}
        >
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(createRequestIdLink).toHaveBeenCalledWith(mockRequestId);
    });

    it('does not call createRequestIdLink if RequestId header has not value', () => {
      const graphQL = mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(createRequestIdLink).not.toHaveBeenCalled();
    });
  });
});
