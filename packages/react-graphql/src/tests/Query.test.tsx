import React from 'react';
import gql from 'graphql-tag';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import {Query} from '../Query';
import {mountWithGraphQL} from '../hooks/tests/utilities';

const petQuery = gql`
  query PetQuery {
    pets {
      name
    }
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

describe('<Query />', () => {
  it('returns the data', async () => {
    const graphQL = createGraphQL({PetQuery: mockData});
    const renderPropSpy = jest.fn(() => null);

    await mountWithGraphQL(<Query query={petQuery}>{renderPropSpy}</Query>, {
      graphQL,
    });

    expect(renderPropSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: mockData,
      }),
    );
  });
});
