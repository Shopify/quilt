import React from 'react';
import {ApolloClient, ApolloLink, NetworkStatus, gql} from '@apollo/client';
import {InMemoryCache} from '@apollo/client/cache';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {createAsyncQueryComponent} from '../../async';
import useAsyncQuery from '../async-query';

import {mountWithGraphQL, createResolvablePromise} from './utilities';

const petQuery = gql`
  query PetQuery {
    pets {
      name
    }
  }
`;

const createGraphQL = createGraphQLFactory();
const mockData = {
  pets: [
    {
      __typename: 'Cat',
      name: 'Garfield',
    },
  ],
};

describe('useQuery', () => {
  describe('async query component', () => {
    it('returns loading=true and networkStatus=undefined during the query document load', async () => {
      const resolvableQuery = createResolvablePromise(petQuery);
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => resolvableQuery.promise,
      });
      function MockQuery({children}) {
        const results = useAsyncQuery(MockQueryComponent);
        return children(results);
      }
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);
      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
        skipInitialGraphQL: true,
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: true,
          networkStatus: undefined,
        }),
      );
    });

    it('returns loading=true and networkStatus=loading after the query document had been loaded', async () => {
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => Promise.resolve(petQuery),
      });

      function MockQuery({children}) {
        const results = useAsyncQuery(MockQueryComponent);
        return children(results);
      }
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);

      const wrapper = await mountWithGraphQL(
        <MockQuery>{renderPropSpy}</MockQuery>,
        {
          graphQL,
          skipInitialGraphQL: true,
        },
      );

      await wrapper.act(async () => {
        await MockQueryComponent.resolver.resolve();
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: true,
          networkStatus: NetworkStatus.loading,
        }),
      );
    });

    it('returns loading=true and networkStatus=loading after the query document had been loaded when ssr option is false', async () => {
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => Promise.resolve(petQuery),
      });

      function MockQuery({children}) {
        const results = useAsyncQuery(MockQueryComponent, {ssr: false});
        return children(results);
      }
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);

      const wrapper = await mountWithGraphQL(
        <MockQuery>{renderPropSpy}</MockQuery>,
        {
          graphQL,
          skipInitialGraphQL: true,
        },
      );

      await wrapper.act(async () => {
        await MockQueryComponent.resolver.resolve();
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: true,
          networkStatus: NetworkStatus.loading,
        }),
      );
    });

    it('returns loading=false, networkStatus, and the query data after the query is done loading', async () => {
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => Promise.resolve(petQuery),
      });

      function MockQuery({children}) {
        const results = useAsyncQuery(MockQueryComponent);
        return children(results);
      }
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);

      const wrapper = await mountWithGraphQL(
        <MockQuery>{renderPropSpy}</MockQuery>,
        {
          graphQL,
        },
      );

      await wrapper.act(async () => {
        await MockQueryComponent.resolver.resolve();
        await graphQL.resolveAll();
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: false,
          networkStatus: NetworkStatus.ready,
          data: mockData,
        }),
      );
    });

    it('watchQuery is not called when skip is true', async () => {
      const mockClient = createMockApolloClient();
      const watchQuerySpy = jest.fn();
      mockClient.watchQuery = watchQuerySpy;

      const MockQueryComponent = createAsyncQueryComponent({
        load: () => Promise.resolve(petQuery),
      });

      function MockQuery() {
        useQuery(MockQueryComponent, {client: mockClient, skip: true});
        return null;
      }

      const graphQL = createGraphQL({PetQuery: mockData});
      await mountWithGraphQL(<MockQuery />, {
        graphQL,
      });

      expect(watchQuerySpy).not.toHaveBeenCalled();
    });
  });
});

function createMockApolloClient() {
  return new ApolloClient({
    link: ApolloLink.empty(),
    cache: new InMemoryCache(),
  });
}
