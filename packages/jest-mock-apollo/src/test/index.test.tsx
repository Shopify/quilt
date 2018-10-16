import * as React from 'react';
import {graphql} from '@shopify/react-apollo';

import {mount} from 'enzyme';
import {readFileSync} from 'fs';
import {buildSchema} from 'graphql';
import * as path from 'path';

import configureClient from '..';
import unionOrIntersectionTypes from './fixtures/schema-unions-and-interfaces.json';
import petQuery from './fixtures/PetQuery.graphql';

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
    loading: boolean;
  };
}

// mock Component
function SomePageBase({data: {loading} = {loading: true}}: Props) {
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
