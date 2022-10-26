import {
  ApolloClient,
  ApolloLink,
  GraphQLRequest,
  InMemoryCache,
  InMemoryCacheConfig,
} from '@apollo/client';

import {MockLink, InflightLink} from './links';
import {Operations} from './operations';
import {operationNameFromFindOptions} from './utilities';
import {GraphQLMock, MockRequest, FindOptions} from './types';

export interface Options {
  cacheOptions?: InMemoryCacheConfig;
  links?: ApolloLink[];
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
    {cacheOptions = {}, links = []}: Options = {},
  ) {
    const cache = new InMemoryCache(cacheOptions);

    this.mockLink = new MockLink(mock || defaultGraphQLMock);
    const link = ApolloLink.from([
      ...links,
      new InflightLink({
        onCreated: this.handleCreate,
        onResolved: this.handleResolve,
      }),
      this.mockLink,
    ]);

    this.client = new ApolloClient({
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

  async resolveFetchMore() {
    await this.withWrapper(async () => {
      await (this.client as any).queryManager.broadcastQueries();
    });
  }

  async resolveAll(options: FindOptions = {}) {
    const finalOperationName = operationNameFromFindOptions(options);

    await this.withWrapper(async () => {
      const allPendingRequests = Array.from(this.pendingRequests);
      const matchingRequests = finalOperationName
        ? allPendingRequests.filter(
            ({operation: {operationName}}) =>
              operationName === finalOperationName,
          )
        : allPendingRequests;

      await Promise.all(matchingRequests.map(({resolve}) => resolve()));
    });
  }

  async withWrapper(cb: () => Promise<void>) {
    await this.wrappers.reduce<() => Promise<void>>(
      (perform, wrapper) => {
        return () => wrapper(perform);
      },
      async () => {
        await cb();
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
