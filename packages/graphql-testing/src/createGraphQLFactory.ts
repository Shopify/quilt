import {GraphQLRequest, ApolloLink} from 'apollo-link';
import {
  ApolloReducerConfig,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {EventEmitter} from 'events';

import {MockLink, InflightLink} from './links';
import {Operations} from './utilities';
import {GraphQLMock, MockRequest} from './types';

export interface Options {
  unionOrIntersectionTypes?: any[];
  cacheOptions?: ApolloReducerConfig;
}

export class GraphQL extends EventEmitter {
  readonly client: ApolloClient<unknown>;
  readonly operations = new Operations();

  private pendingRequests = new Set<MockRequest>();

  constructor(
    mock: GraphQLMock,
    {unionOrIntersectionTypes = [], cacheOptions = {}}: Options = {},
  ) {
    super();

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

    const link = ApolloLink.from([
      new InflightLink({
        onCreated: this.handleCreate,
        onResolved: this.handleResolve,
      }),
      new MockLink(mock),
    ]);

    this.client = new ApolloClient({
      link,
      cache,
    });
  }

  on(event: 'pre-resolve', handler: () => void): this;
  on(event: 'post-resolve', handler: () => void): this;
  on(event: string, handler: (...args: any[]) => void) {
    return super.on(event, handler);
  }

  async resolveAll() {
    const promise = Promise.all(
      Array.from(this.pendingRequests).map(({resolve}) => resolve()),
    );

    this.emit('pre-resolve');

    await promise;

    this.emit('post-resolve');
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
    `Can’t perform GraphQL operation '${operationName ||
      ''}' because no mocks were set.`,
  );
}

export function createGraphQLFactory(options?: Options) {
  return function createGraphQL(mock: GraphQLMock = defaultGraphQLMock) {
    return new GraphQL(mock, options);
  };
}
