import {gql} from '@apollo/client';
import {GraphQLError} from 'graphql';

import {MockGraphQLResponse} from '../../types';
import {MockLink} from '../mocks';

import {executeOnce} from './utilities';

const petQuery = gql`
  query Pet {
    pets {
      ...CatInfo
    }
  }

  fragment CatInfo on Cat {
    name
  }
`;

describe('MockLink', () => {
  it('returns a result when there is an object matching an operation', async () => {
    const data = {pets: [{name: 'Spike'}]};
    const link = new MockLink({Pet: data});
    const {result} = await executeOnce(link, petQuery);
    expect(result).toStrictEqual({data});
  });

  it('returns a result when there is an function matching an operation', async () => {
    const data = {pets: [{name: 'Spike'}]};
    const spy = jest.fn(() => data);
    const link = new MockLink({Pet: spy});
    const {result} = await executeOnce(link, petQuery);

    expect(result).toStrictEqual({data});
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({query: petQuery}),
    );
  });

  it('returns an error message when the mock looks like a fixture', async () => {
    const link = new MockLink({});
    const {result} = await executeOnce(link, petQuery);

    expect(result).toMatchObject(
      new Error(
        "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, simply change your code to read 'mockGraphQLClient({Pet: yourFixture}).'",
      ),
    );
  });

  it('returns an error message when there are no matching mocks', async () => {
    const link = new MockLink({LostPets: {}, PetsForSale: {}});
    const {result} = await executeOnce(link, petQuery);

    expect(result).toMatchObject(
      new Error(
        "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (you provided an object that had mocks only for the following operations: LostPets, PetsForSale).",
      ),
    );
  });

  it('returns an error message when no fixture is returned from a mock', async () => {
    const link = new MockLink(() => (null as unknown) as MockGraphQLResponse);

    const {result} = await executeOnce(link, petQuery);

    expect(result).toMatchObject(
      new Error(
        "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (you provided a function that did not return a valid mock result)",
      ),
    );
  });

  it('returns a GraphQLError when there is a GraphQLError matching an operation', async () => {
    const error = new GraphQLError(
      'error message',
      undefined,
      undefined,
      undefined,
      ['path1', 'path2'],
    );
    const link = new MockLink({
      Pet: error,
    });
    const {result} = await executeOnce(link, petQuery);

    expect(result).toMatchObject({errors: [error]});
  });

  it('returns a GraphQLError with the message from an Error matching an operation', async () => {
    const error = new Error('error message');
    const link = new MockLink({
      Pet: error,
    });
    const {result} = await executeOnce(link, petQuery);

    expect(result).toMatchObject({errors: [new GraphQLError(error.message)]});
  });
});
