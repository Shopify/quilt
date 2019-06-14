import {DocumentNode} from 'graphql';
import {ApolloLink, GraphQLRequest} from 'apollo-link';
import {
  ApolloReducerConfig,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {Arguments} from '@shopify/useful-types';

import {MockLink, InflightLink} from './links';
import {Operations} from './operations';
import {
  operationNameFromFindOptions,
  operationNameFromDocument,
} from './utilities';
import {
  GraphQLMock,
  MockRequest,
  FindOptions,
  Operation,
  MockGraphQLResponse,
  MockGraphQLFunction,
} from './types';

type OperationMatcher = (operation: Operation) => boolean;

export interface Options {
  unionOrIntersectionTypes?: any[];
  cacheOptions?: ApolloReducerConfig;
  resolveImmediately?: boolean | OperationMatcher;
}

interface Wrapper {
  (perform: () => Promise<void>): Promise<void>;
}

interface MockRecord {
  mock: MockGraphQLResponse | MockGraphQLFunction;
  operation?: string | DocumentNode | {resolved?: DocumentNode};
}

export class GraphQL {
  readonly client: ApolloClient<unknown>;
  readonly operations = new Operations();

  private readonly pendingRequests = new Set<MockRequest>();
  private readonly wrappers: Wrapper[] = [];
  private shouldResolveImmediately: OperationMatcher;
  private mocks: Mocks;

  constructor(
    mock: GraphQLMock | undefined,
    {
      cacheOptions = {},
      unionOrIntersectionTypes = [],
      resolveImmediately = () => true,
    }: Options = {},
  ) {
    this.mocks = new Mocks(mock);
    this.shouldResolveImmediately = normalizeResolver(resolveImmediately);

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
      new MockLink(mock || defaultGraphQLMock),
    ]);

    this.client = new ApolloClient({
      link,
      cache,
    });
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

  resolveImmediately(
    resolver: NonNullable<Options['resolveImmediately']> = true,
  ) {
    this.shouldResolveImmediately = normalizeResolver(resolver);
    return this;
  }

  mock(...args: Arguments<Mocks['add']>) {
    this.mocks.add(...args);
    return this;
  }

  wrap(wrapper: Wrapper) {
    this.wrappers.push(wrapper);
    return this;
  }

  private handleCreate = (request: MockRequest) => {
    this.pendingRequests.add(request);

    if (this.shouldResolveImmediately(request.operation)) {
      request.resolve();
    }
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

function normalizeResolver(
  resolver: NonNullable<Options['resolveImmediately']>,
) {
  return typeof resolver === 'boolean' ? () => resolver : resolver;
}

class Mocks {
  private readonly mockRecords: MockRecord[];

  constructor(mock: GraphQLMock = defaultGraphQLMock) {
    this.mockRecords = getMockRecords(mock);
  }

  add(
    operation: DocumentNode | {resolved?: DocumentNode} | string,
    mock: MockGraphQLResponse | MockGraphQLFunction,
  ) {
    this.mockRecords.push({
      mock,
      operation,
    });
  }

  get(operation: Operation): MockGraphQLResponse | MockGraphQLFunction {
    const operationName = operationNameFromDocument(operation.query);

    const matched = this.mockRecords.find(({operation}) => {
      if (operation == null) {
        return true;
      }

      if (typeof operation === 'string') {
        return operation === operationName;
      }

      return operationNameFromDocument(operation) === operationName;
    });

    if (matched == null) {
      throw new Error('');
    }

    return typeof matched.mock === 'function'
      ? (matched.mock as any)(operation)
      : matched.mock;
  }
}

function getMockRecords(mock: GraphQLMock): MockRecord[] {
  if (typeof mock === 'function') {
    return [{mock}];
  } else if (
    mock[Symbol.iterator] &&
    Array.isArray(mock[Symbol.iterator]().next().value)
  ) {
    return [...mock].map(([operation, mock]) => ({
      mock,
      operation,
    }));
  } else if (typeof mock === 'object') {
    return Object.entries(mock).map(([operation, mock]) => ({
      mock,
      operation,
    }));
  }

  return [];
}
