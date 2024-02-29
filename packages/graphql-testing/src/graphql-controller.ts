import type {DefaultOptions, InMemoryCacheConfig} from '@apollo/client';
import {ApolloClient, ApolloLink, InMemoryCache} from '@apollo/client';

import {MockLink, InflightLink} from './links';
import {Operations} from './operations';
import {operationNameFromFindOptions} from './utilities';
import type {GraphQLMock, MockRequest, FindOptions} from './types';

export interface Options {
  cacheOptions?: InMemoryCacheConfig;
  links?: ApolloLink[];
  defaultOptions?: DefaultOptions;
}

interface ResolveAllFindOptions extends FindOptions {
  filter?: (operation: MockRequest['operation']) => boolean;
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
    {cacheOptions = {}, links = [], defaultOptions = {}}: Options = {},
  ) {
    const cache = new InMemoryCache(cacheOptions);

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
      connectToDevTools: false,
      link,
      cache,
      defaultOptions,
    });
  }

  update(mock: GraphQLMock) {
    if (!this.mockLink) {
      return;
    }
    this.mockLink.updateMock(mock);
  }

  async resolveAll(options: ResolveAllFindOptions = {}) {
    let requestFilter: ((operation: MockRequest) => boolean) | undefined;

    if (Object.keys(options).length) {
      const finalOperationName = operationNameFromFindOptions(options);
      requestFilter = ({operation}) => {
        const nameMatchesOrWasNotSet = finalOperationName
          ? finalOperationName === operation.operationName
          : true;

        const customFilterMatchesOrWasNotSet = options.filter
          ? options.filter(operation)
          : true;

        return nameMatchesOrWasNotSet && customFilterMatchesOrWasNotSet;
      };
    }

    await this.withWrapper(async () => {
      const allPendingRequests = Array.from(this.pendingRequests);
      const matchingRequests = requestFilter
        ? allPendingRequests.filter(requestFilter)
        : allPendingRequests;

      await Promise.all(matchingRequests.map(({resolve}) => resolve()));
    });
  }

  async waitForQueryUpdates() {
    // queryManager is an internal implementation detail that is a TS-private
    // property. We can access it in JS but TS thinks we can't so cast to any
    // to shut typescript up
    await this.withWrapper(async () => {
      await (this.client as any).queryManager.broadcastQueries();
    });
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

  private async withWrapper(cb: () => Promise<void>) {
    await this.wrappers.reduce<() => Promise<void>>(
      (perform, wrapper) => {
        return () => wrapper(perform);
      },
      async () => {
        await cb();
      },
    )();
  }
}
