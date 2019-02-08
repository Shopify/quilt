import * as React from 'react';
import * as PropTypes from 'prop-types';
import {graphql} from 'react-apollo';

import {mount} from 'enzyme';

import createGraphQLFactory from '../createGraphQLFactory';
import unionOrIntersectionTypes from './fixtures/schema-unions-and-interfaces.json';
import petQuery from './fixtures/PetQuery.graphql';

// setup
const createGraphQL = createGraphQLFactory({
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

  return (
    <>
      <p>{loading ? 'Loading' : 'Loaded!'}</p>
      <p>{pets && pets.length ? pets[0].name : 'No pets'}</p>
      {errorMessage}
    </>
  );
}
const SomePage = graphql(petQuery)(SomePageBase);

const graphQL = createGraphQL({
  Pet: {
    pets: [
      {
        __typename: 'Cat',
        name: 'Garfield',
      },
    ],
  },
});

describe('graphql-testing', () => {
  it('throws error when no mock provided', async () => {
    const graphQL = createGraphQL();
    const somePage = mount(<SomePage />, {
      context: {
        client: graphQL.client,
      },
      childContextTypes: {
        client: PropTypes.object,
      },
    });

    await graphQL.resolveAll();
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
        client: graphQL.client,
      },
      childContextTypes: {
        client: PropTypes.object,
      },
    });

    await graphQL.resolveAll();
    somePage.update();

    const query = graphQL.operations.last({operationName: 'Pet'});
    expect(query).toMatchObject({operationName: 'Pet'});

    expect(somePage.containsMatchingElement(<p>Garfield</p>)).toBe(true);
  });
});
