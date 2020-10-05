import {readFileSync} from 'fs';
import path from 'path';

import React from 'react';
import {ApolloClient} from 'apollo-client';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {ApolloProvider} from '@apollo/react-common';
import {buildSchema} from 'graphql';
import {createMount} from '@shopify/react-testing';

import unionOrIntersectionTypes from './fixtures/schema-unions-and-interfaces.json';
import {
  PetQuery as petQuery,
  PetMutation as petMutation,
} from './fixtures/PetQuery.graphql';

import configureClient from '..';

const schemaSrc = readFileSync(
  path.resolve(__dirname, './fixtures/schema.graphql'),
  'utf8',
);
const schema = buildSchema(schemaSrc);
const createGraphQLClient = configureClient({
  schema,
  unionOrIntersectionTypes,
});

const mount = createMount<{client: ApolloClient<any>}, {}>({
  render(element, _, {client}) {
    return <ApolloProvider client={client}>{element}</ApolloProvider>;
  },
});

function SomePage() {
  const {
    data: {pets: queryData} = {pets: []},
    error: queryError = {message: ''},
    loading: queryLoading = true,
  } = useQuery(petQuery);
  const [
    mutate,
    {
      data: {pets: mutationData} = {pets: []},
      error: mutationError = {message: ''},
      loading: mutationLoading = true,
    },
  ] = useMutation(petMutation);

  const errorMarkup = `${queryError.message} ${mutationError.message}`;
  const loadingMarkup = queryLoading || mutationLoading ? 'Loading' : 'Loaded!';
  const pets = [...queryData, ...mutationData];
  const petsMarkup =
    pets && pets.length ? pets.map(pets => pets.name).join(', ') : 'No pets';

  return (
    <>
      <p>{loadingMarkup}</p>
      <p>{petsMarkup}</p>
      <p>{errorMarkup}</p>
      <button
        type="submit"
        onClick={async () => {
          try {
            await mutate({variables: {name: 'Sophie'}});
          } catch (error) {
            return undefined;
          }
        }}
      >
        Mutate
      </button>
    </>
  );
}

async function clickButton(wrapper) {
  await wrapper.find('button', {type: 'submit'}).trigger('onClick');
}

async function waitToResolve(wrapper, graphQLClient = client) {
  await wrapper.act(() => Promise.all(graphQLClient.graphQLResults));
}

async function expectQueryError(wrapper, graphQLClient, errorMessage) {
  const errorSpy = jest.fn();

  await wrapper.act(() =>
    Promise.all(graphQLClient.graphQLResults).catch(error => {
      errorSpy(error.message);
      return null;
    }),
  );

  expect(errorSpy).toHaveBeenCalledWith(errorMessage);

  return true;
}

const PetQuery = {
  pets: [
    {
      __typename: 'Cat',
      name: 'Garfield',
    },
  ],
};
const PetMutation = ({variables: {name}}) => ({
  pets: [
    {
      __typename: 'Cat',
      name,
    },
  ],
});
const client = createGraphQLClient({
  PetQuery,
  PetMutation,
});

describe('jest-mock-apollo', () => {
  it('throws error when no mock provided', async () => {
    const client = createGraphQLClient();
    const somePage = mount(<SomePage />, {client});

    expect(
      await expectQueryError(
        somePage,
        client,
        "Can’t perform GraphQL operation 'PetQuery' because no valid mocks were found (it looks like you provided an empty mock object)",
      ),
    ).toBe(true);
  });

  describe('queries', () => {
    it('resolves mock query and renders data', async () => {
      const somePage = mount(<SomePage />, {
        client,
      });

      await waitToResolve(somePage, client);

      const query = client.graphQLRequests.lastOperation('PetQuery');

      expect(query).toMatchObject({operationName: 'PetQuery'});
      expect(somePage).toContainReactText('Garfield');
    });

    it('throws useful error when query is not mocked', async () => {
      const client = createGraphQLClient({
        PetMutation,
      });
      const somePage = mount(<SomePage />, {
        client,
      });

      expect(
        await expectQueryError(
          somePage,
          client,
          "Can’t perform GraphQL operation 'PetQuery' because no valid mocks were found (you provided an object that had mocks only for the following operations: PetMutation)",
        ),
      ).toBe(true);
    });
  });

  describe('mutations', () => {
    it('resolves mock mutation', async () => {
      const somePage = mount(<SomePage />, {
        client,
      });

      await waitToResolve(somePage, client);
      await clickButton(somePage);
      await waitToResolve(somePage, client);

      const query = client.graphQLRequests.lastOperation('PetMutation');

      expect(query).toMatchObject({operationName: 'PetMutation'});
      expect(somePage).toContainReactText('Garfield, Sophie');
    });

    it('throws useful error when mutation is not mocked', async () => {
      const client = createGraphQLClient({
        PetQuery,
      });
      const somePage = mount(<SomePage />, {
        client,
      });

      await waitToResolve(somePage, client);
      clickButton(somePage);

      expect(
        await expectQueryError(
          somePage,
          client,
          "Can’t perform GraphQL operation 'PetMutation' because no valid mocks were found (you provided an object that had mocks only for the following operations: PetQuery)",
        ),
      ).toBe(true);
    });
  });
});
