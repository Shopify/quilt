import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from '@apollo/client';

export function createSsrExtractableLink() {
  return new SsrExtractableLink();
}

export class SsrExtractableLink extends ApolloLink {
  private readonly operations = new Set<Promise<void>>();

  resolveAll<T>(then: () => T): Promise<T> | T {
    if (this.operations.size > 0) {
      return Promise.all([...this.operations]).then(then);
    }

    return then();
  }

  request(operation: Operation, nextLink?: NextLink) {
    if (nextLink == null) {
      throw new Error(
        'SsrExtractableLink must not be the last link in the chain.',
      );
    }

    let operationDone: Function;

    const promise = new Promise<void>((resolve) => {
      operationDone = () => {
        this.operations.delete(promise);
        resolve();
      };
    });

    this.operations.add(promise);

    return new Observable<FetchResult>((observer) => {
      return nextLink(operation).subscribe({
        complete() {
          observer.complete();
          operationDone();
        },
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
      });
    });
  }
}
