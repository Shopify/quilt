import React from 'react';
import gql from 'graphql-tag';
import ApolloClient, {NetworkStatus} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {createAsyncQueryComponent} from '../../async';
import useLazyQuery from '../lazy-query';

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

// function Hello() {
//   const [loadGreeting, { called, loading, data }] = useLazyQuery(
//     GET_GREETING,
//     { variables: { language: "english" } }
//   );
//   if (called && loading) return <p>Loading ...</p>
//   if (!called) {
//     return <button onClick={() => loadGreeting()}>Load greeting</button>
//   }
//   return <h1>Hello {data.greeting.message}!</h1>;
// }

describe('useLazyQuery', () => {
  describe('document', () => {
    it('returns loading=false and networkStatus=loading during the loading of query', async () => {
      const mockClient = createMockApolloClient();
      const watchQuerySpy = jest.fn();
      mockClient.watchQuery = watchQuerySpy;

      // function MockQuery() {
      //   useQuery(petQuery, {client: mockClient, skip: true});
      //   return null;
      // }
      function MockQuery({children}) {
        const [loadResults, results] = useLazyQuery(petQuery);
        return children(results);
      }

      // const graphQL = createGraphQL({PetQuery: mockData});
      // await mountWithGraphQL(<MockQuery />, {
      //   graphQL,
      // });
      const graphQL = createGraphQL({PetQuery: mockData});
      const renderPropSpy = jest.fn(data => {
        console.log(data);
        return null;
      });

      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
        // skipInitialGraphQL: true,
      });

      expect(watchQuerySpy).not.toHaveBeenCalled();
      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: undefined,
          loading: false,
          networkStatus: NetworkStatus.ready,
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
