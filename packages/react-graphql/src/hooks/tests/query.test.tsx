import * as React from 'react';
import gql from 'graphql-tag';
import {NetworkStatus} from 'apollo-client';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {createAsyncQueryComponent} from '../../async';
import useQuery from '../query';
import {
  mountWithGraphQL,
  prepareAsyncReactTasks,
  teardownAsyncReactTasks,
  createResolvablePromise,
} from './utilities';

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
  beforeEach(() => {
    prepareAsyncReactTasks();
  });

  afterEach(() => {
    teardownAsyncReactTasks();
  });

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
        await MockQueryComponent.resolve();
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
        await MockQueryComponent.resolve();
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
  });
});
