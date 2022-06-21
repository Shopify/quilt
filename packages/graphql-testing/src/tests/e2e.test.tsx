import React, {useCallback} from 'react';
import gql from 'graphql-tag';
import {DocumentNode} from 'graphql-typed';
import {mount} from '@shopify/react-testing';
import {ApolloProvider, useQuery} from '@shopify/react-graphql';

import {createGraphQLFactory} from '..';

const createGraphQL = createGraphQLFactory();

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

function MyComponent({id = '1'} = {}) {
  const {data, loading, error, refetch} = useQuery(petQuery, {variables: {id}});

  const errorMarkup = error ? <p>Error</p> : null;
  const networkErrorMarkup =
    error && error.networkError ? <p>NetworkError</p> : null;
  const graphqlErrorMarkup =
    error && error.graphQLErrors.length ? <p>GraphQLError</p> : null;
  const loadingMarkup = loading ? <p>Loading</p> : null;
  const petsMarkup =
    data != null && data.pet != null ? <p>{data.pet.name}</p> : null;
  const handleButtonClick = useCallback(() => refetch(), [refetch]);

  return (
    <>
      {loadingMarkup}
      {petsMarkup}
      {errorMarkup}
      {networkErrorMarkup}
      {graphqlErrorMarkup}
      <button onClick={handleButtonClick} type="button">
        Refetch!
      </button>
    </>
  );
}

describe('graphql-testing', () => {
  it('does not resolve immediately', () => {
    const graphQL = createGraphQL({
      Pet: {
        pet: {
          __typename: 'Cat',
          name: 'Garfield',
        },
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    expect(graphQL).not.toHavePerformedGraphQLOperation(petQuery);
    expect(myComponent).toContainReactText('Loading');
  });

  it('resolves to an error when there is no matching mock set', async () => {
    const graphQL = createGraphQL();

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery);
    expect(myComponent).toContainReactText('Error');
  });

  it('resolves to an network error when an error is thrown', async () => {
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
    expect(myComponent).toContainReactText('Error');
    expect(myComponent).toContainReactText('NetworkError');
    expect(myComponent).not.toContainReactText('GraphQLError');
  });

  it('resolves to an graphql error when an error is thrown', async () => {
    const graphQL = createGraphQL({
      Pet: new Error('GraphQL'),
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    expect(graphQL).toHavePerformedGraphQLOperation(petQuery);
    expect(myComponent).toContainReactText('Error');
    expect(myComponent).toContainReactText('GraphQLError');
    expect(myComponent).not.toContainReactText('NetworkError');
  });

  it('resolves a query with a provided mock', async () => {
    const id = '123';
    const name = 'Garfield';
    const graphQL = createGraphQL({
      Pet: {
        pet: {
          __typename: 'Cat',
          name: 'Garfield',
        },
      },
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
    expect(myComponent).toContainReactText(name);
  });

  it('allows for mock updates after it has been initialized', async () => {
    const newName = 'Garfield2';
    const graphQL = createGraphQL({
      Pet: {
        pet: {
          __typename: 'Cat',
          name: 'Garfield',
        },
      },
    });

    const myComponent = mount(
      <ApolloProvider client={graphQL.client}>
        <MyComponent id="123" />
      </ApolloProvider>,
    );

    graphQL.wrap((resolve) => myComponent.act(resolve));
    await graphQL.resolveAll();

    graphQL.update({
      Pet: {
        pet: {
          __typename: 'Cat',
          name: newName,
        },
      },
    });

    const request = myComponent.find('button').trigger('onClick');
    await graphQL.resolveAll();
    await request;

    expect(myComponent).toContainReactText(newName);
  });
});
