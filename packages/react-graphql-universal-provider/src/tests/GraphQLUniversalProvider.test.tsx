import React from 'react';
import {InMemoryCache, ApolloLink} from '@apollo/client';
import {extract} from '@shopify/react-effect/server';
import {mount} from '@shopify/react-testing';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {ApolloProvider} from '@shopify/react-graphql';
import {NetworkContext, NetworkManager} from '@shopify/react-network';

import {GraphQLUniversalProvider} from '../GraphQLUniversalProvider';

jest.mock('@apollo/client', () => {
  const ApolloClient = jest.requireActual('@apollo/client').ApolloClient;
  const mockApolloClient = jest.fn((options) => new ApolloClient(options));

  return {
    ...jest.requireActual('@apollo/client'),
    default: mockApolloClient,
    ApolloClient: mockApolloClient,
  };
});

jest.mock('../utilities', () => ({
  ...jest.requireActual('../utilities'),
  isServer: jest.fn(),
}));
const {isServer} = jest.requireMock('../utilities');

jest.mock('../request-id-link', () => ({
  ...jest.requireActual('../request-id-link'),
  createRequestIdLink: jest.fn(),
}));
const {createRequestIdLink} = jest.requireMock('../request-id-link');

jest.mock('../csrf-link', () => ({
  ...jest.requireActual('../csrf-link'),
  createCsrfLink: jest.fn(),
}));
const {createCsrfLink} = jest.requireMock('../csrf-link');

const ApolloClient = jest.requireMock('@apollo/client').ApolloClient;

describe('<GraphQLUniversalProvider />', () => {
  beforeEach(() => {
    isServer.mockClear();
    isServer.mockImplementation(() => true);

    ApolloClient.mockClear();
    createRequestIdLink.mockClear();
    createCsrfLink.mockClear();
  });

  it('renders an ApolloProvider with a client created by the factory', () => {
    const graphQL = mount(
      <NetworkContext.Provider value={new NetworkManager()}>
        <GraphQLUniversalProvider createClientOptions={() => ({})} />
      </NetworkContext.Provider>,
    );

    expect(graphQL).toContainReactComponent(ApolloProvider, {
      client: expect.any(jest.requireActual('@apollo/client').ApolloClient),
    });
  });

  it('includes a link if none are given', () => {
    mount(
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
      mount(
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

      mount(
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

    it('serializes the apollo cache to a custom id and re-uses it to hydrate the cache', async () => {
      const htmlManager = new HtmlManager();

      const cache = new InMemoryCache();

      const graphQLProvider = (
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider
            id="graphql-cache"
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

      mount(
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

      mount(
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

      mount(
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
      mount(
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
      mount(
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

      mount(
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

      mount(
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

      mount(
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

      mount(
        <NetworkContext.Provider
          value={new NetworkManager({headers: {'X-Request-ID': mockRequestId}})}
        >
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(createRequestIdLink).toHaveBeenCalledWith(mockRequestId);
    });

    it('does not call createRequestIdLink if RequestId header has not value', () => {
      mount(
        <NetworkContext.Provider value={new NetworkManager()}>
          <GraphQLUniversalProvider createClientOptions={() => ({})} />
        </NetworkContext.Provider>,
      );

      expect(createRequestIdLink).not.toHaveBeenCalled();
    });

    it('does not call createRequestIdLink if addRequestId is false', () => {
      const mockRequestId = 'request-id-value';

      mount(
        <NetworkContext.Provider
          value={new NetworkManager({headers: {'X-Request-ID': mockRequestId}})}
        >
          <GraphQLUniversalProvider
            createClientOptions={() => ({})}
            addRequestId={false}
          />
        </NetworkContext.Provider>,
      );

      expect(createRequestIdLink).not.toHaveBeenCalled();
    });
  });

  describe('createCsrfLink', () => {
    it('calls createCsrfLink if quiltRails is true', () => {
      mount(<GraphQLUniversalProvider createClientOptions={() => ({})} />);

      expect(createCsrfLink).toHaveBeenCalledWith();
    });

    it('does not call createCsrfLink if quiltRails is false', () => {
      mount(
        <GraphQLUniversalProvider
          createClientOptions={() => ({})}
          quiltRails={false}
        />,
      );

      expect(createCsrfLink).not.toHaveBeenCalled();
    });
  });
});
