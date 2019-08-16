import BaseApolloClient, {ApolloClientOptions} from 'apollo-client';
import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';

import {NormalizedCacheObject} from 'apollo-cache-inmemory';

class SsrExtractableLink extends ApolloLink {
  private readonly operations = new Set<Promise<void>>();

  constructor(private readonly link: ApolloLink) {
    super();
  }

  resolveAll<T>(then: () => T): Promise<T> | T {
    if (this.operations.size > 0) {
      return Promise.all([...this.operations]).then(then);
    }

    return then();
  }

  request(operation: Operation, nextLink?: NextLink) {
    if (nextLink != null) {
      throw new Error('SsrExtractableLink must be the only link in the chain.');
    }

    let operationDone: Function;

    const promise = new Promise<void>(resolve => {
      operationDone = () => {
        this.operations.delete(promise);
        resolve();
      };
    });

    this.operations.add(promise);

    return new Observable<FetchResult>(observer => {
      return this.link.request(operation)!.subscribe({
        complete() {
          observer.complete();
          operationDone();
        },
        next: observer.next.bind(observer),
        error: observer.next.bind(observer),
      });
    });
  }
}

export class ApolloClient<CacheShape> extends BaseApolloClient<CacheShape> {
  constructor(options: ApolloClientOptions<CacheShape>) {
    super({
      ...options,
      link: options.link && new SsrExtractableLink(options.link),
    });
  }

  resolve(): Promise<NormalizedCacheObject> | NormalizedCacheObject {
    return this.link instanceof SsrExtractableLink
      ? this.link.resolveAll(() => this.extract())
      : (this.extract() as any);
  }
}
