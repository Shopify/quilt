import {ApolloLink} from 'apollo-link';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  InMemoryCacheConfig,
} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';

import {TestingApolloClient} from './client';
import {MockLink, InflightLink} from './links';
import {Operations} from './operations';
import {operationNameFromFindOptions} from './utilities';
import {GraphQLMock, MockRequest, FindOptions} from './types';

export interface Options {
  unionOrIntersectionTypes?: any[];
  cacheOptions?: InMemoryCacheConfig;
  links?: ApolloLink[];
  assumeImmutableResults?: boolean;
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
    mock: GraphQLMock = {},
    {
      unionOrIntersectionTypes = [],
      cacheOptions = {},
      links = [],
      assumeImmutableResults = false,
    }: Options = {},
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

    this.mockLink = new MockLink(mock);
    const link = ApolloLink.from([
      ...links,
      new InflightLink({
        onCreated: this.handleCreate,
        onResolved: this.handleResolve,
      }),
      this.mockLink,
    ]);

    this.client = new TestingApolloClient({
      assumeImmutableResults,
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
    const {filter: customFilter} = options;

    await this.wrappers.reduce<() => Promise<void>>(
      (perform, wrapper) => {
        return () => wrapper(perform);
      },
      async () => {
        const allPendingRequests = Array.from(this.pendingRequests);
        
        let matchingRequests = allPendingRequests;

        if (customFilter) {
          matchingRequests = allPendingRequests.filter(
            ({operation}) => customFilter(operation)
          );
        }
        else if (finalOperationName) {
          matchingRequests = allPendingRequests.filter(
            ({operation}) => {
              const {operationName} = operation;
              return operationName === finalOperationName;
            },
          );
        }

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
