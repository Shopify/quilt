import * as React from 'react';
import {graphql} from '@shopify/react-apollo';

import {mount} from 'enzyme';

import {registerSchema, createGraphQLClient} from '..';
import unionOrIntersectionTypes from './fixtures/schema-unions-and-interfaces.json';
import petQuery from './fixtures/PetQuery.graphql';

// setup
registerSchema({
  schemaBuildPath: './fixtures/schema.graphql',
  unionOrIntersectionTypes,
});

interface Props {
  data: {
    loading: boolean;
  };
}

// mock Component
function SomePageBase({data: {loading}}: Props) {
  return <p>{loading ? 'Loading' : 'Loaded!'}</p>;
}

const SomePage = graphql(petQuery)(SomePageBase) as React.ComponentType;

describe('jest-mock-apollo', () => {
  it('just works', () => {
    mount(<SomePage />, {
      context: {
        client: createGraphQLClient(),
      },
    });
  });
});
