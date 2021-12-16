import React, {Component} from 'react';

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

  const promise = new Promise<T>((resolve) => {
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

export function createCatcher(callback: (error: Error) => void) {
  return class Catcher extends Component<{}, {error?: Error}> {
    static getDerivedStateFromError(error: Error) {
      return {error};
    }

    state: {error?: Error} = {};

    componentDidCatch(error: Error) {
      callback(error);
    }

    render() {
      return this.state.error ? null : this.props.children;
    }
  };
}

export const IGNORE_ERRORS = [
  /The above error occurred in the <.*> component/,
  /at Object.invokeGuardedCallbackDev/,
];

/* eslint-disable no-console */
export function withIgnoredReactErrorLogs(perform: () => unknown) {
  const originalConsoleError = console.error;

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      IGNORE_ERRORS.some((regex) => regex.test(args[0]))
    ) {
      return;
    }

    return originalConsoleError(...args);
  };

  const cleanup = () => {
    console.error = originalConsoleError;
  };

  const result = perform();

  if (
    typeof result === 'object' &&
    result != null &&
    'then' in result &&
    'catch' in result
  ) {
    return (result as Promise<unknown>)
      .then((resolvedResult) => {
        cleanup();
        return resolvedResult;
      })
      .catch((error) => {
        cleanup();
        return error;
      });
  }

  cleanup();
  return result;
}
/* eslint-enable no-console */
