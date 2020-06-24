import {ApolloLink, GraphQLRequest} from 'apollo-link';
import {
  ApolloReducerConfig,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';

import {TestingApolloClient} from './client';
import {MockLink, InflightLink} from './links';
import {Operations} from './operations';
import {operationNameFromFindOptions} from './utilities';
import {GraphQLMock, MockRequest, FindOptions} from './types';

export interface Options {
  unionOrIntersectionTypes?: any[];
  cacheOptions?: ApolloReducerConfig;
}

interface Wrapper {
  (perform: () => Promise<void>): Promise<void>;
}

export class GraphQL {
  readonly client: ApolloClient<unknown>;
  readonly operations = new Operations();

  private readonly pendingRequests = new Set<MockRequest>();
  private readonly wrappers: Wrapper[] = [];
  private readonly mockLink: MockLink | null = null;

  constructor(
    mock: GraphQLMock | undefined,
    {unionOrIntersectionTypes = [], cacheOptions = {}}: Options = {},
  ) {
    const cache = new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: unionOrIntersectionTypes,
          },
        },
      }),
      ...cacheOptions,
    });

    this.mockLink = new MockLink(mock || defaultGraphQLMock);
    const link = ApolloLink.from([
      new InflightLink({
        onCreated: this.handleCreate,
        onResolved: this.handleResolve,
      }),
      this.mockLink,
    ]);

    this.client = new TestingApolloClient({
      link,
      cache,
    });
  }

  update(mock: GraphQLMock) {
    if (!this.mockLink) {
      return;
    }
    this.mockLink.updateMock(mock);
  }

  async resolveAll(options: FindOptions = {}) {
    const finalOperationName = operationNameFromFindOptions(options);

    await this.wrappers.reduce<() => Promise<void>>(
      (perform, wrapper) => {
        return () => wrapper(perform);
      },
      async () => {
        const allPendingRequests = Array.from(this.pendingRequests);
        const matchingRequests = finalOperationName
          ? allPendingRequests.filter(
              ({operation: {operationName}}) =>
                operationName === finalOperationName,
            )
          : allPendingRequests;

        await Promise.all(matchingRequests.map(({resolve}) => resolve()));
      },
    )();
  }

  wrap(wrapper: Wrapper) {
    this.wrappers.push(wrapper);
  }

  private handleCreate = (request: MockRequest) => {
    this.pendingRequests.add(request);
  };

  private handleResolve = (request: MockRequest) => {
    this.operations.push(request.operation);
    this.pendingRequests.delete(request);
  };
}

function defaultGraphQLMock({operationName}: GraphQLRequest) {
  return new Error(
    `Can’t perform GraphQL operation '${
      operationName || ''
    }' because no mocks were set.`,
  );
}
