import * as React from 'react';
import {graphql} from '@shopify/react-apollo';

import {mount} from 'enzyme';
import {readFileSync} from 'fs';
import * as path from 'path';

import createGraphQLClientFactory from '..';
import unionOrIntersectionTypes from './fixtures/schema-unions-and-interfaces.json';
import petQuery from './fixtures/PetQuery.graphql';

// setup
const createGraphQLClient = createGraphQLClientFactory({
  schemaSrc: readFileSync(
    path.resolve(__dirname, './fixtures/schema.graphql'),
    'utf8',
  ),
  unionOrIntersectionTypes,
});

interface Props {
  data?: {
    loading: boolean;
  };
}

// mock Component
function SomePageBase({data: {loading}}: Props) {
  return <p>{loading ? 'Loading' : 'Loaded!'}</p>;
}

const SomePage = graphql(petQuery)(SomePageBase);

describe('jest-mock-apollo', () => {
  it('provides the required context', () => {
    mount(<SomePage />, {
      context: {
        client: createGraphQLClient(),
      },
    });
  });
});
