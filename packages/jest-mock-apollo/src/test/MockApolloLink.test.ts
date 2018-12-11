import {readFileSync} from 'fs';
import {buildSchema} from 'graphql';
import * as path from 'path';

import MockApolloLink from '../MockApolloLink';
import {MockGraphQLResponse} from '../types';

import petQuery from './fixtures/PetQuery.graphql';

const schemaSrc = readFileSync(
  path.resolve(__dirname, './fixtures/schema.graphql'),
  'utf8',
);
const schema = buildSchema(schemaSrc);

const mockRequest = {
  query: petQuery,
  operationName: 'Pets',
  variables: {},
  extensions: {},
  setContext: () => ({}),
  getContext: () => ({}),
  toKey: () => '',
};

describe('MockApolloLink', () => {
  it('returns error message with empty mock object', async () => {
    const mockApolloLink = new MockApolloLink({}, schema);

    const result = await new Promise(resolve => {
      mockApolloLink.request(mockRequest).subscribe(resolve);
    });

    expect(result).toMatchObject({
      message:
        "Can’t perform GraphQL operation 'Pets' because no valid mocks were found (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, simply change your code to read 'mockGraphQLClient({Pets: yourFixture}).'",
    });
  });

  it('returns error message when there are no matching mocks', async () => {
    const mockApolloLink = new MockApolloLink(
      {LostPets: {}, PetsForSale: {}},
      schema,
    );

    const result = await new Promise(resolve => {
      mockApolloLink.request(mockRequest).subscribe(resolve);
    });

    expect(result).toMatchObject({
      message:
        "Can’t perform GraphQL operation 'Pets' because no valid mocks were found (you provided an object that had mocks only for the following operations: LostPets, PetsForSale).",
    });
  });

  it('returns error message with empty mock function', async () => {
    const mockApolloLink = new MockApolloLink(
      () => (null as unknown) as MockGraphQLResponse,
      schema,
    );

    const result = await new Promise(resolve => {
      mockApolloLink.request(mockRequest).subscribe(resolve);
    });

    expect(result).toMatchObject({
      message:
        "Can’t perform GraphQL operation 'Pets' because no valid mocks were found (you provided a function that did not return a valid mock result)",
    });
  });
});
