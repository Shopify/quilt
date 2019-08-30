import React from 'react';
import gql from 'graphql-tag';
import ApolloClient, {NetworkStatus} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {createAsyncQueryComponent} from '../../async';
import useQuery from '../query';
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
  describe('document', () => {
    it('returns loading=true and networkStatus=loading during the loading of query', async () => {
      function MockQuery({children}) {
        const results = useQuery(petQuery);
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
          networkStatus: NetworkStatus.loading,
        }),
      );
    });

    it('return loading=false, networkStatus and the data once the query resolved', async () => {
      function MockQuery({children}) {
        const results = useQuery(petQuery);
        return children(results);
      }

      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);

      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
      });

      const lastQuery = graphQL.operations.last({operationName: 'PetQuery'});
      expect(lastQuery).toMatchObject({operationName: 'PetQuery'});

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: false,
          networkStatus: NetworkStatus.ready,
          data: mockData,
        }),
      );
    });

    it('keeps the same data when the variables stay deep-equal', async () => {
      function MockQuery({
        children,
        variables,
      }: {
        children: (
          result: ReturnType<typeof useQuery>,
        ) => React.ReactElement | null;
        variables?: object;
      }) {
        const results = useQuery(petQuery, {variables});
        return children(results);
      }

      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);
      const variables = {foo: 'bar'};

      const mockQuery = await mountWithGraphQL(
        <MockQuery variables={variables}>{renderPropSpy}</MockQuery>,
        {
          graphQL,
        },
      );

      mockQuery.setProps({variables: {...variables}});

      expect(graphQL.operations.all()).toHaveLength(1);

      // Once for initial render while loading, once for when the data loaded, and a final time
      // when we update the props and re-render the component.
      expect(renderPropSpy).toHaveBeenCalledTimes(3);

      const [, firstLoadedCall, secondLoadedCall] = renderPropSpy.mock.calls;
      expect(firstLoadedCall[0]).toBe(secondLoadedCall[0]);
    });

    it('watchQuery is not called when skip is true', async () => {
      const mockClient = createMockApolloClient();
      const watchQuerySpy = jest.fn();
      mockClient.watchQuery = watchQuerySpy;

      function MockQuery() {
        useQuery(petQuery, {client: mockClient, skip: true});
        return null;
      }

      const graphQL = createGraphQL({PetQuery: mockData});
      await mountWithGraphQL(<MockQuery />, {
        graphQL,
      });

      expect(watchQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe('async query component', () => {
    it('returns loading=true and networkStatus=undefined during the query document load', async () => {
      const resolvableQuery = createResolvablePromise(petQuery);
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => resolvableQuery.promise,
      });
      function MockQuery({children}) {
        const results = useQuery(MockQueryComponent);
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
        const results = useQuery(MockQueryComponent);
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
        const results = useQuery(MockQueryComponent);
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
