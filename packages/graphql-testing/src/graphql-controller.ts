import {
  ApolloClient,
  ApolloLink,
  InMemoryCacheConfig,
  InMemoryCache,
  PossibleTypesMap,
} from '@apollo/client';

// import {TestingApolloClient} from './client';
import {MockLink, InflightLink} from './links';
import {Operations} from './operations';
import {operationNameFromFindOptions} from './utilities';
import {GraphQLMock, MockRequest, FindOptions} from './types';

export interface Options {
  possibleTypes?: PossibleTypesMap;
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
    {possibleTypes = {}, cacheOptions = {}, links = []}: Options = {},
  ) {
    const cache = new InMemoryCache({
      possibleTypes,
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
