import {MockGraphQLResponse} from '../types';
import {executeOnce} from './utilities/apollo-link';

import MockApolloLink from '../MockApolloLink';
import petQuery from './fixtures/PetQuery.graphql';

describe('MockApolloLink', () => {
  it('returns error message with empty mock object', async () => {
    const mockApolloLink = new MockApolloLink({});
    const {result} = await executeOnce(mockApolloLink, petQuery);

    expect(result).toMatchObject(
      new Error(
        "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (it looks like you tried to provide data directly to the mock GraphQL client. You need to provide your fixture on the key that matches its operation name. To fix this, simply change your code to read 'mockGraphQLClient({Pet: yourFixture}).'",
      ),
    );
  });

  it('returns error message when there are no matching mocks', async () => {
    const mockApolloLink = new MockApolloLink({LostPets: {}, PetsForSale: {}});
    const {result} = await executeOnce(mockApolloLink, petQuery);

    expect(result).toMatchObject(
      new Error(
        "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (you provided an object that had mocks only for the following operations: LostPets, PetsForSale).",
      ),
    );
  });

  it('returns error message with empty mock function', async () => {
    const mockApolloLink = new MockApolloLink(
      () => (null as unknown) as MockGraphQLResponse,
    );

    const {result} = await executeOnce(mockApolloLink, petQuery);

    expect(result).toMatchObject(
      new Error(
        "Can’t perform GraphQL operation 'Pet' because no valid mocks were found (you provided a function that did not return a valid mock result)",
      ),
    );
  });
});
