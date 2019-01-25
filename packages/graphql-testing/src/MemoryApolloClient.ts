import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {Omit} from '@shopify/useful-types';

import MemoryApolloLink from './MemoryApolloLink';
import Operations from './Operations';
import {MockRequest} from './types';

type MemoryApolloClientOptions = Omit<ApolloClientOptions<unknown>, 'link'> & {
  link?: ApolloLink;
};

export default class MemoryApolloClient extends ApolloClient<unknown> {
  readonly operations: Operations;
  readonly pendingRequests: Set<MockRequest>;

  constructor(options: MemoryApolloClientOptions) {
    const memoryLink = new MemoryApolloLink();
    super({
      ...options,
      link: options.link ? memoryLink.concat(options.link) : memoryLink,
    });

    this.operations = new Operations();
    this.pendingRequests = new Set<MockRequest>();

    memoryLink.onRequestCreated(this.onRequestCreated.bind(this));
    memoryLink.onRequestResolved(this.onRequestResolved.bind(this));
  }

  async resolveAll() {
    await Promise.all(
      Array.from(this.pendingRequests).map(({resolve}) => resolve()),
    );
  }

  private onRequestCreated(request: MockRequest) {
    this.operations.push(request.operation);
    this.pendingRequests.add(request);
  }

  private onRequestResolved(request: MockRequest) {
    this.pendingRequests.delete(request);
  }
}
