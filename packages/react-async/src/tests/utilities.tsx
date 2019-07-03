import {PrefetchManager, Registration} from '../context/prefetch';

export * from '../testing';

export function createPrefetchManager(
  registered: Registration[] = [],
): PrefetchManager {
  return new PrefetchManager(registered);
}

export function createResolvablePromise<T>(value: T) {
  let promiseResolve!: (value: T) => void;
  let resolved = false;

  const promise = new Promise<T>(resolve => {
    promiseResolve = resolve;
  });

  return {
    promise,
    resolve: () => {
      promiseResolve(value);
      resolved = true;
      return promise;
    },
    resolved: () => resolved,
  };
}

export function createRejectablePromise<T extends Error>(value: T) {
  let promiseReject!: (value: T) => void;
  let rejected = false;

  // eslint-disable-next-line promise/param-names
  const promise = new Promise<any>((_, reject) => {
    promiseReject = reject;
  });

  return {
    promise,
    reject: () => {
      promiseReject(value);
      rejected = true;
      return promise.catch(() => {});
    },
    rejected: () => rejected,
  };
}
