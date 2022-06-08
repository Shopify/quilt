import React from 'react';
import {
  ApolloClient,
  NetworkStatus,
  ApolloLink,
  InMemoryCache,
  gql,
  ApolloError,
} from '@apollo/client';
import {DocumentNode} from 'graphql-typed';
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

const peopleQuery: DocumentNode<
  {people?: {name: string; friends?: {name: string}[] | null} | null},
  {id: string}
> = gql`
  query People($id: ID!) {
    people(id: $id) {
      ...PeopleInfo
    }
  }

  fragment PeopleInfo on People {
    name
    friends
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
          error: expect.any(ApolloError),
        }),
      );
    });

    it('renders twice, loading=true, followed by error', async () => {
      function MockQuery({children}) {
        const results = useQuery(petQuery);
        return children(results);
      }

      const graphQL = createGraphQL({PetQuery: new Error()});
      const renderPropSpy = jest.fn(() => null);

      await mountWithGraphQL(<MockQuery>{renderPropSpy}</MockQuery>, {
        graphQL,
      });

      // expect loading and error renders only
      expect(renderPropSpy).toHaveBeenCalledTimes(2);
      expect(renderPropSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: undefined,
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
        const results = useQuery(MockQueryComponent, {ssr: false});
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

  describe('refetch', () => {
    const lukeMock = {
      people: [
        {
          __typename: 'People',
          name: 'Luke',
          friends: [],
        },
      ],
    };

    const hanMock = {
      people: [
        {
          __typename: 'People',
          name: 'Han',
          friends: [],
        },
      ],
    };

    function MyComponent({id = '1'} = {}) {
      const {data, loading, error, refetch} = useQuery(peopleQuery, {
        variables: {id},
      });

      const errorMarkup = error ? <p>Error</p> : null;
      const networkErrorMarkup =
        error && error.networkError ? <p>NetworkError</p> : null;
      const graphqlErrorMarkup =
        error && error.graphQLErrors.length ? <p>GraphQLError</p> : null;
      const loadingMarkup = loading ? <p>Loading</p> : null;
      const peopleMarkup =
        data != null && data.people != null ? (
          <p>{data.people[0].name}</p>
        ) : null;

      // apollo will surpress thrown ApolloErrors except
      // when fetchPolicy is network-only which is what
      // refetch uses, so for the test we catch and ignore
      // the thrown error, the error is still returned
      const handleButtonClick = React.useCallback(
        () => refetch().catch((_) => {}),
        [refetch],
      );

      return (
        <>
          {loadingMarkup}
          {peopleMarkup}
          {errorMarkup}
          {networkErrorMarkup}
          {graphqlErrorMarkup}
          <button onClick={handleButtonClick} type="button">
            Refetch!
          </button>
        </>
      );
    }

    it('recovers and renders from a network error', async () => {
      const graphQL = createGraphQL({People: lukeMock});

      const wrapper = await mountWithGraphQL(<MyComponent />, {
        graphQL,
      });

      expect(wrapper).toContainReactText('Luke');

      graphQL.update({
        People: () => {
          throw new Error('Connection');
        },
      });

      const firstClick = wrapper.find('button').trigger('onClick');
      await graphQL.resolveAll();
      await firstClick;

      expect(wrapper).toContainReactText('NetworkError');

      graphQL.update({
        People: lukeMock,
      });

      const secondClick = wrapper.find('button').trigger('onClick');
      await graphQL.resolveAll();
      await secondClick;

      expect(wrapper).toContainReactText('Luke');
    });

    it('updates the component when response changes', async () => {
      const graphQL = createGraphQL({People: lukeMock});

      const wrapper = await mountWithGraphQL(<MyComponent />, {
        graphQL,
      });

      expect(wrapper).toContainReactText('Luke');

      graphQL.update({
        People: hanMock,
      });

      const firstClick = wrapper.find('button').trigger('onClick');
      await graphQL.resolveAll();
      await firstClick;

      expect(wrapper).toContainReactText('Han');

      graphQL.update({
        People: lukeMock,
      });

      const secondClick = wrapper.find('button').trigger('onClick');
      await graphQL.resolveAll();
      await secondClick;

      expect(wrapper).toContainReactText('Luke');
    });
  });
});

function createMockApolloClient() {
  return new ApolloClient({
    link: ApolloLink.empty(),
    cache: new InMemoryCache(),
  });
}
