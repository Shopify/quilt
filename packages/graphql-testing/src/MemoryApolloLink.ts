import {ApolloLink, Observable, Operation, NextLink} from 'apollo-link';

import {MockRequest} from './types';

export default class MemoryApolloLink extends ApolloLink {
  private onRequestCreatedCallback:
    | ((request: MockRequest) => void)
    | undefined;
  private onRequestResolvedCallback:
    | ((request: MockRequest) => void)
    | undefined;

  constructor() {
    super();
  }

  request(operation: Operation, nextLink?: NextLink) {
    if (nextLink == null || !nextLink) {
      throw new Error('The memory link must not be a terminating link');
    }

    let resolver: Function;

    const promise = new Promise<void>(resolve => {
      resolver = resolve;
    });

    const request = {
      operation,
      resolve: () => {
        resolver();
        this.onRequestResolvedCallback &&
          this.onRequestResolvedCallback(request);

        return promise;
      },
    };

    this.onRequestCreatedCallback && this.onRequestCreatedCallback(request);

    return new Observable(observer => {
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

  onRequestCreated(onRequestCreated: (request: MockRequest) => void) {
    this.onRequestCreatedCallback = onRequestCreated;
  }

  onRequestResolved(onRequestResolved: (request: MockRequest) => void) {
    this.onRequestResolvedCallback = onRequestResolved;
  }
}
