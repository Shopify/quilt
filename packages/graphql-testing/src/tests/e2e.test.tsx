import React, {useCallback} from 'react';
import {GraphQLError} from 'graphql';
import {gql} from '@apollo/client';
import {DocumentNode} from 'graphql-typed';
import {mount} from '@shopify/react-testing';
import {ApolloProvider, useQuery, ApolloError} from '@shopify/react-graphql';

import {createGraphQLFactory} from '..';

const createGraphQL = createGraphQLFactory();
const createImmutableGraphQL = createGraphQLFactory({
  assumeImmutableResults: true,
  cacheOptions: {freezeResults: true},
});

const petQuery: DocumentNode<{pet?: {name: string} | null}, {id: string}> = gql`
  query Pet($id: ID!) {
    pet(id: $id) {
      ...CatInfo
    }
  }

  fragment CatInfo on Cat {
    name
  }
`;

const petsQuery: DocumentNode<
  {pets: {edges: {cursor: string; node: {name: string}}[]}},
  {first: number; after?: string | null}
> = gql`
  query Pets($first: Number!, $after: String) {
    pets(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...CatInfo
        }
      }
    }
  }

  fragment CatInfo on Cat {
    name
  }
`;

function ApolloResult({result}: {result: ReturnType<typeof useQuery>}) {
  return null;
}

function MyComponent({id = '1'} = {}) {
  const queryResult = useQuery(petQuery, {variables: {id}});
  const {data, loading, error, refetch} = queryResult;

  const errorMarkup = error ? <p className="error">{error.message}</p> : null;
  const loadingMarkup = loading ? <p>Loading</p> : null;
  const petsMarkup =
    data != null && data.pet != null ? <p>{data.pet.name}</p> : null;
  const handleButtonClick = useCallback(() => refetch(), [refetch]);

  const handleMutateButtonClick = () => {
    if (data?.pet?.name) {
      data.pet.name = 'fluffy';
    }
  };

  return (
    <>
      <ApolloResult result={queryResult} />
      {loadingMarkup}
      {petsMarkup}
      {errorMarkup}
      <button onClick={handleButtonClick} type="button">
        Refetch!
      </button>
      <button onClick={handleMutateButtonClick} type="button">
        Mutate!
      </button>
    </>
  );
}

function MyComponentWithFetchMore({itemsPerPage = 1} = {}) {
  const {data, loading, fetchMore} = useQuery(petsQuery, {
    variables: {first: itemsPerPage},
  });

  const loadingMarkup = loading ? <p>Loading</p> : null;
  const petsMarkup = data ? (
    <>
      LoadedNames:{' '}
      {data.pets.edges.map((petEdge) => petEdge.node.name).join('&')}
      <br />
      LoadedCount: {data.pets.edges.length}
    </>
  ) : null;

  const handleFetchMoreButtonClick = async () => {
    if (!data || data.pets.edges.length === 0) {
      return;
    }
    const edges = data.pets.edges;
    const cursor = edges[edges.length - 1].cursor;

    await fetchMore({
      variables: {first: itemsPerPage, after: cursor},
      updateQuery({pets: {edges: oldEdges}}, {fetchMoreResult}) {
        const pets = fetchMoreResult && fetchMoreResult.pets;

        return {
          ...fetchMoreResult,
          pets: {
            ...pets,
            edges: [...oldEdges, ...(pets?.edges ?? [])],
          },
        };
      },
    });
  };

  return (
    <>
      {loadingMarkup}
      {petsMarkup}
      <button onClick={handleFetchMoreButtonClick} type="button">
        FetchMore!
      </button>
    </>
  );
}

describe('graphql-testing', () => {
  it('does not resolve immediately', () => {
    const graphQL = createGraphQL({
      Pet: {
        pet: {__typename: 'Cat', name: 'Garfield'},
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    expect(graphQL).not.toHavePerformedGraphQLOperation(petQuery);
    const queryResult = myComponent.find(ApolloResult)!.prop('result');
    expect(queryResult.loading).toBe(true);
    expect(myComponent).toContainReactText('Loading');
  });

  it('allows assumeImmutableResults and freezeResults to be set', async () => {
    const graphQL = createImmutableGraphQL({
      Pet: {
        pet: {__typename: 'Cat', name: 'Garfield'},
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(() => {
      myComponent.findAll('button')[1].trigger('onClick');
    }).toThrow(
      "Cannot assign to read only property 'name' of object '#<Object>'",
    );
  });

  it('resolves to a NetworkError when there are no mocks set', async () => {
    const graphQL = createGraphQL();

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery);
    const queryResult = myComponent.find(ApolloResult)!.prop('result');

    expect(queryResult.error).toStrictEqual(
      new ApolloError({
        graphQLErrors: [],
        networkError: new Error(
          "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (you provided an empty object that contained no mocks)",
        ),
      }),
    );
  });

  it('resolves to a NetworkError when there is no matching mock', async () => {
    // Create mock for Pets, but the component under test calls Pet
    const graphQL = createGraphQL({
      Pets: {
        pets: {__typename: 'Pets', edges: []},
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery);
    const queryResult = myComponent.find(ApolloResult)!.prop('result');

    expect(queryResult.error).toStrictEqual(
      new ApolloError({
        graphQLErrors: [],
        networkError: new Error(
          "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (you provided an object that had mocks only for the following operations: Pets)",
        ),
      }),
    );
  });

  it('resolves to a NetworkError when a query throws an error', async () => {
    const graphQL = createGraphQL({
      Pet: () => {
        throw new Error('Connection');
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery);
    const queryResult = myComponent.find(ApolloResult)!.prop('result');

    expect(queryResult.error).toStrictEqual(
      new ApolloError({
        graphQLErrors: [],
        networkError: new Error('Connection'),
      }),
    );
  });

  it('resolves to a GraphQLError when a query returns an error', async () => {
    const graphQL = createGraphQL({
      Pet: new Error('MyError'),
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery);
    const queryResult = myComponent.find(ApolloResult)!.prop('result');

    expect(queryResult.error).toStrictEqual(
      new ApolloError({
        graphQLErrors: [new GraphQLError('MyError')],
        networkError: null,
      }),
    );
  });

  it('resolves a query with provided data mock', async () => {
    const id = '123';
    const mockPetQueryData = {pet: {__typename: 'Cat', name: 'Garfield'}};
    const graphQL = createGraphQL({
      Pet: mockPetQueryData,
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent id={id} />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery, {
      id,
    });
    const queryResult = myComponent.find(ApolloResult)!.prop('result');
    expect(queryResult.data).toStrictEqual(mockPetQueryData);
    expect(myComponent).toContainReactText('Garfield');
  });

  it('allows for mock updates after it has been initialized', async () => {
    const mockPetQueryData = {pet: {__typename: 'Cat', name: 'Garfield'}};
    const graphQL = createGraphQL({
      Pet: mockPetQueryData,
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent id="123" />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    const newMockPetQueryData = {pet: {__typename: 'Cat', name: 'Garfield2'}};
    graphQL.update({
      Pet: newMockPetQueryData,
    });

    const request = myComponent.find('button').trigger('onClick');
    await graphQL.resolveAll();
    await request;

    const queryResult = myComponent.find(ApolloResult)!.prop('result');
    expect(queryResult.data).toStrictEqual(newMockPetQueryData);
    expect(myComponent).toContainReactText('Garfield2');
  });

  it('handles fetchMore', async () => {
    const graphQL = createGraphQL({
      Pets: ({
        variables: {first = 10, after},
      }: {
        variables: {first?: number; after: string};
      }) => {
        const fullData = [
          {cursor: 'a', node: {__typename: 'Cat', name: 'Garfield'}},
          {cursor: 'b', node: {__typename: 'Cat', name: 'Nermal'}},
          {cursor: 'c', node: {__typename: 'Cat', name: 'Arlene'}},
          {cursor: 'd', node: {__typename: 'Cat', name: 'Not Odie'}},
        ].map((item) => ({__typename: 'Edge', ...item}));

        // eslint-disable-next-line jest/no-if
        const startPosition = after
          ? fullData.findIndex((item) => item.cursor === after) + 1
          : 0;

        return {
          pets: {
            __typename: 'Pets',
            edges: fullData.slice(startPosition, startPosition + first),
          },
        };
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponentWithFetchMore />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petsQuery, {
      first: 1,
    });

    // Start with just one item loaded
    expect(myComponent).toContainReactText('LoadedNames: Garfield');
    expect(myComponent).toContainReactText('LoadedCount: 1');

    // Trigger a fetchMore, and see that LoadedNames/Count updates with
    // an additional item
    const request = myComponent.find('button').trigger('onClick');
    await graphQL.resolveAll();
    await request;

    expect(graphQL).toHavePerformedGraphQLOperation(petsQuery, {
      first: 1,
      after: 'a',
    });
    expect(myComponent).toContainReactText('LoadedNames: Garfield&Nermal');
    expect(myComponent).toContainReactText('LoadedCount: 2');

    // Trigger another fetchMore, and see that LoadedNames/Count updates with
    // an additional item
    const request2 = myComponent.find('button').trigger('onClick');
    await graphQL.resolveAll();
    await request2;

    expect(graphQL).toHavePerformedGraphQLOperation(petsQuery, {
      first: 1,
      after: 'b',
    });
    expect(myComponent).toContainReactText(
      'LoadedNames: Garfield&Nermal&Arlene',
    );
    expect(myComponent).toContainReactText('LoadedCount: 3');
  });
});
