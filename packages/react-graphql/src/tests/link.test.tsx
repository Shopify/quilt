/**
 * @jest-environment node
 */

import React from 'react';
import {WatchQueryFetchPolicy} from 'apollo-client';
import gql from 'graphql-tag';
import {extract} from '@shopify/react-effect/server';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import useQuery from '../hooks/query';
import {ApolloProvider} from '../ApolloProvider';
import {createSsrExtractableLink} from '../links';

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

interface QueryOptions {
  fetchPolicy?: WatchQueryFetchPolicy;
  ssr?: boolean;
}

function MockQuery({fetchPolicy = 'network-only', ssr}: QueryOptions) {
  const {data, loading} = useQuery(petQuery, {fetchPolicy, ssr});
  const dataMarkup = data ? JSON.stringify(data) : 'no data';
  return loading ? <div>loading</div> : <pre>{dataMarkup}</pre>;
}

describe('ssrLink', () => {
  it('ssrLink.resolveAll returns data and resolves', async () => {
    const ssrLink = createSsrExtractableLink();
    const graphQL = createGraphQL({PetQuery: mockData, links: [ssrLink]});
    const afterEachSpy = jest.fn();

    const extractPromise = extract(
      <ApolloProvider client={graphQL.client}>
        <MockQuery fetchPolicy="cache-and-network" ssr />
      </ApolloProvider>,
      {
        afterEachPass: afterEachSpy,
      },
    );

    await graphQL.resolveAll();
    await extractPromise;

    const data = await ssrLink.resolveAll(() => graphQL.client.extract());
    expect(data).toMatchObject({
      ROOT_QUERY: {
        __typename: 'Query',
        pets: [{__typename: 'Cat', name: 'Garfield'}],
      },
    });

    // One call for the first pass, another call after the GraphQL
    // resolves
    expect(afterEachSpy).toHaveBeenCalledTimes(2);
  });
});
