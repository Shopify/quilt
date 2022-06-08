/**
 * @jest-environment node
 */

import React from 'react';
import {renderToString} from 'react-dom/server';
import gql from 'graphql-tag';
import {FetchPolicy} from '@apollo/client';
import {extract} from '@shopify/react-effect/server';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import useQuery from '../query';
import {ApolloProvider} from '../../ApolloProvider';

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
  fetchPolicy?: FetchPolicy;
  ssr?: boolean;
}

function MockQuery({fetchPolicy = 'network-only', ssr}: QueryOptions) {
  const {data, loading} = useQuery(petQuery, {fetchPolicy, ssr});
  const dataMarkup = data ? JSON.stringify(data) : 'no data';
  return loading ? <div>loading</div> : <pre>{dataMarkup}</pre>;
}

describe('useQuery', () => {
  it('does not loop infinitely when a query has network-only during SSR', async () => {
    const graphQL = createGraphQL({PetQuery: mockData});
    const afterEachSpy = jest.fn();

    const extractPromise = extract(
      <ApolloProvider client={graphQL.client}>
        <MockQuery fetchPolicy="network-only" />
      </ApolloProvider>,
      {
        afterEachPass: afterEachSpy,
      },
    );

    await graphQL.resolveAll();
    await extractPromise;

    // One call for the first pass, another call after the GraphQL
    // resolves
    expect(afterEachSpy).toHaveBeenCalledTimes(2);
  });

  it('does not run a query with the no-cache fetch policy during SSR', async () => {
    const graphQL = createGraphQL({PetQuery: mockData});
    const afterEachSpy = jest.fn();
    const element = (
      <ApolloProvider client={graphQL.client}>
        <MockQuery fetchPolicy="no-cache" />
      </ApolloProvider>
    );

    const extractPromise = extract(element, {
      afterEachPass: afterEachSpy,
    });

    await graphQL.resolveAll();
    await extractPromise;

    // One call for the first pass, which is the only one because there are
    // no GraphQL queries to resolve.
    expect(afterEachSpy).toHaveBeenCalledTimes(1);

    // Not loading and no data
    const markup = renderToString(element);
    expect(markup).not.toContain('loading');
    expect(markup).toContain('no data');
  });

  it('does not run a query when `ssr` option is set to false during SSR', async () => {
    const graphQL = createGraphQL({PetQuery: mockData});
    const afterEachSpy = jest.fn();
    const element = (
      <ApolloProvider client={graphQL.client}>
        <MockQuery ssr={false} />
      </ApolloProvider>
    );

    const extractPromise = extract(element, {
      afterEachPass: afterEachSpy,
    });

    await graphQL.resolveAll();
    await extractPromise;

    // One call for the first pass, which is the only one because there are
    // no GraphQL queries to resolve.
    expect(afterEachSpy).toHaveBeenCalledTimes(1);

    // Not loading and no data
    const markup = renderToString(element);
    expect(markup).not.toContain('loading');
    expect(markup).toContain('no data');
  });

  it('runs a query when `ssr` option is set to true during SSR', async () => {
    const graphQL = createGraphQL({PetQuery: mockData});
    const afterEachSpy = jest.fn();
    const element = (
      <ApolloProvider client={graphQL.client}>
        <MockQuery ssr />
      </ApolloProvider>
    );

    const extractPromise = extract(element, {
      afterEachPass: afterEachSpy,
    });

    await graphQL.resolveAll();
    await extractPromise;

    // One call for the first pass, another call after the GraphQL resolves
    expect(afterEachSpy).toHaveBeenCalledTimes(2);
  });

  it('runs a query when `ssr` option is missing during SSR', async () => {
    const graphQL = createGraphQL({PetQuery: mockData});
    const afterEachSpy = jest.fn();
    const element = (
      <ApolloProvider client={graphQL.client}>
        <MockQuery />
      </ApolloProvider>
    );

    const extractPromise = extract(element, {
      afterEachPass: afterEachSpy,
    });

    await graphQL.resolveAll();
    await extractPromise;

    // One call for the first pass, another call after the GraphQL resolves
    expect(afterEachSpy).toHaveBeenCalledTimes(2);
  });
});
