import React from 'react';
import {ApolloClient, ApolloLink, NetworkStatus, gql} from '@apollo/client';
import {InMemoryCache} from '@apollo/client/cache';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {useQuery} from '../index';

import {mountWithGraphQL} from './utilities';

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

    it('returns loading=true and networkStatus=loading during the loading of query when ssr option is false', async () => {
      function MockQuery({children}) {
        const results = useQuery(petQuery, {ssr: false});
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

    it('returns previous data if the fetchPolicy=no-cache and the current query has error', async () => {
      function MockQuery({children}) {
        const results = useQuery(petQuery, {fetchPolicy: 'no-cache'});
        return children(results);
      }

      const graphQL = createGraphQL({PetQuery: new Error()});
      const renderPropSpy = jest.fn(() => null);

      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
      });

      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: undefined,
        }),
      );
    });
  });
});

function createMockApolloClient() {
  return new ApolloClient({
    link: ApolloLink.empty(),
    cache: new InMemoryCache(),
  });
}
