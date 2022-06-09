import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from '@apollo/client';

import {MockRequest} from '../types';

interface Options {
  onCreated(request: MockRequest): void;
  onResolved(request: MockRequest): void;
}

export class InflightLink extends ApolloLink {
  constructor(private options: Options) {
    super();
  }

  request(
    operation: Operation,
    nextLink?: NextLink,
  ): Observable<FetchResult> | null {
    if (nextLink == null || !nextLink) {
      throw new Error('The memory link must not be a terminating link');
    }

    let resolver: Function;

    const promise = new Promise<void>((resolve) => {
      resolver = resolve;
    });

    const request = {
      operation,
      resolve: () => {
        resolver();
        this.options.onResolved(request);
        return promise;
      },
    };

    this.options.onCreated(request);

    return new Observable((observer) => {
      return nextLink(operation).subscribe({
        complete() {
          const complete = observer.complete.bind(observer);
          promise.then(complete).catch(complete);
        },
        next(result) {
          const next = observer.next.bind(observer, result);
          promise.then(next).catch(next);
        },
        error(error) {
          const fail = observer.error.bind(observer, error);
          promise.then(fail).catch(fail);
        },
      });
    });
  }
}
