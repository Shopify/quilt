/* eslint-disable promise/catch-or-return */
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

    let operationsCompleteResolver: () => void;

    const operationsCompletePromise = new Promise<void>((resolve) => {
      operationsCompleteResolver = resolve;
    });

    const request = {
      operation,
      resolve: async () => {
        resolver();
        await operationsCompletePromise;
        this.options.onResolved(request);
      },
    };

    this.options.onCreated(request);

    return new Observable((observer) => {
      return nextLink(operation).subscribe({
        complete() {
          const complete = observer.complete.bind(observer);
          promise
            .then(complete)
            .catch(complete)
            .finally(operationsCompleteResolver);
        },
        next(result) {
          const next = observer.next.bind(observer, result);
          promise.then(next).catch(next).finally(operationsCompleteResolver);
        },
        error(error) {
          const fail = observer.error.bind(observer, error);
          promise.then(fail).catch(fail).finally(operationsCompleteResolver);
        },
      });
    });
  }
}
