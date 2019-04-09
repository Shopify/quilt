import * as React from 'react';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {createAsyncQueryComponent} from '../../async';
import useQuery from '../query';
import {
  mountWithGraphQL,
  prepareAsyncReactTasks,
  teardownAsyncReactTasks,
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
    it('resolves mock query and return data', async () => {
      const MockQuery = ({children}) => {
        const results = useQuery(petQuery);
        return children(results);
      };

      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);

      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
        skipInitialGraphQL: true,
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: true,
        }),
      );

      await graphQL.resolveAll();

      const lastQuery = graphQL.operations.last({operationName: 'PetQuery'});
      expect(lastQuery).toMatchObject({operationName: 'PetQuery'});

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: false,
          data: mockData,
        }),
      );
    });
  });

  describe('async query component', () => {
    it('returns loading=false during the document loading state', async () => {
      const resolvableQuery = createResolvablePromise(petQuery);
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => resolvableQuery.promise,
      });
      const MockQuery = ({children}) => {
        const results = useQuery(MockQueryComponent);
        return children(results);
      };
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);
      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
        skipInitialGraphQL: true,
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith({
        data: undefined,
        error: undefined,
        loading: true,
        networkStatus: undefined,
        variables: undefined,
        refetch: expect.any(Function),
        fetchMore: expect.any(Function),
        updateQuery: expect.any(Function),
        startPolling: expect.any(Function),
        stopPolling: expect.any(Function),
        subscribeToMore: expect.any(Function),
        client: expect.any(ApolloClient),
      });
    });

    it('returns loading=true after the query document had been loaded, the query is now in loading state', async () => {
      const resolvableQuery = createResolvablePromise(petQuery);
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => resolvableQuery.promise,
      });

      const MockQuery = ({children}) => {
        const results = useQuery(MockQueryComponent);
        return children(results);
      };
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);
      const mockQuery = await mountWithGraphQL(
        <MockQuery>{renderPropSpy}</MockQuery>,
        {
          graphQL,
          skipInitialGraphQL: true,
        },
      );

      mockQuery.act(() => {
        resolvableQuery.resolve();
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: true,
        }),
      );
    });

    it('returns loading=false with the query data after the query is done loading', async () => {
      const MockQueryComponent = createAsyncQueryComponent({
        load: () => Promise.resolve(petQuery),
      });

      await MockQueryComponent.resolve();

      const MockQuery = ({children}) => {
        const results = useQuery(MockQueryComponent);
        return children(results);
      };
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(() => null);
      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: mockData,
          loading: false,
        }),
      );
    });
  });

  it.todo('re-quering something, the result changed');
});

function createResolvablePromise<T>(value: T) {
  let resolver!: () => Promise<T>;
  let rejecter!: () => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolver = () => {
      resolve(value);
      return promise;
    };
    rejecter = reject;
  });

  return {
    resolve: async () => {
      const value = await resolver();
      // If we just resolve, the tick that actually processes the promise
      // has not finished yet.
      await new Promise(resolve => process.nextTick(resolve));
      return value;
    },
    reject: rejecter,
    promise,
  };
}
