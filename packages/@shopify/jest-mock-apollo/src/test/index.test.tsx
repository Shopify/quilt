import {readFileSync} from 'fs';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';

import {mount} from 'enzyme';
import {buildSchema} from 'graphql';

import unionOrIntersectionTypes from './fixtures/schema-unions-and-interfaces.json';
import petQuery from './fixtures/PetQuery.graphql';
import configureClient from '..';

// setup
const schemaSrc = readFileSync(
  path.resolve(__dirname, './fixtures/schema.graphql'),
  'utf8',
);
const schema = buildSchema(schemaSrc);
const createGraphQLClient = configureClient({
  schema,
  unionOrIntersectionTypes,
});

interface Props {
  data?: {
    loading?: boolean;
    pets?: any[];
    error?: any;
  };
}

// mock Component
function SomePageBase(props: Props) {
  if (!props.data) {
    return null;
  }
  const {
    data: {loading = true, pets, error},
  } = props;
  const errorMessage = error ? <p>{error.message}</p> : null;

  const loadingMarkup = loading ? 'Loading' : 'Loaded!';
  const petsMarkup = pets && pets.length ? pets[0].name : 'No pets';
  return (
    <>
      <p>{loadingMarkup}</p>
      <p>{petsMarkup}</p>
      {errorMessage}
    </>
  );
}
const SomePage = graphql(petQuery)(SomePageBase);

const client = createGraphQLClient({
  Pet: {
    pets: [
      {
        __typename: 'Cat',
        name: 'Garfield',
      },
    ],
  },
});

describe('jest-mock-apollo', () => {
  it('throws error when no mock provided', async () => {
    const client = createGraphQLClient();
    const somePage = mount(<SomePage />, {
      context: {
        client,
      },
      childContextTypes: {
        client: PropTypes.object,
      },
    });

    await Promise.all(client.graphQLRequests);
    somePage.update();

    expect(
      somePage.containsMatchingElement(
        <p>
          GraphQL error: Can’t perform GraphQL operation {"'Pet'"} because no
          mocks were set.
        </p>,
      ),
    ).toBe(true);
  });

  it('resolves mock query and renders data', async () => {
    const somePage = mount(<SomePage />, {
      context: {
        client,
      },
      childContextTypes: {
        client: PropTypes.object,
      },
    });

    await Promise.all(client.graphQLRequests);
    somePage.update();
    const query = client.graphQLRequests.lastOperation('Pet');
    expect(query).toMatchObject({operationName: 'Pet'});

    expect(somePage.containsMatchingElement(<p>Garfield</p>)).toBe(true);
  });
});
