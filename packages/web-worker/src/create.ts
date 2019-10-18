import {createEndpoint, Endpoint} from './endpoint';

const workerEndpointCache = new WeakMap<Endpoint<any>['call'], Endpoint<any>>();

export function expose(
  caller: Endpoint<any>['call'],
  api: {[key: string]: Function | undefined},
) {
  const endpoint = getEndpoint(caller);
  return endpoint && endpoint.expose(api);
}

export function terminate(caller: Endpoint<any>['call']) {
  const endpoint = getEndpoint(caller);
  if (endpoint) {
    endpoint.terminate();
  }

  workerEndpointCache.delete(caller);
}

export function getEndpoint(caller: Endpoint<any>['call']) {
  return workerEndpointCache.get(caller);
}

export function createWorkerFactory<T>(script: () => Promise<T>) {
  return function createWorker(): Endpoint<T>['call'] {
    // The babel plugin that comes with this package actually turns the argument
    // into a string (the public path of the worker script). If it’s a function,
    // it’s because we’re in an environment where we didn’t transform it into a
    // worker. In that case, we can use the fact that we will get access to the
    // real module and pretend to be a worker that way.
    if (typeof script === 'function') {
      return new Proxy(
        {},
        {
          get(_target, property) {
            return async (...args: any[]) => {
              const module = await script();
              return module[property](...args);
            };
          },
        },
      ) as any;
    }

    // If we aren’t in an environment that supports Workers, just bail out
    // with a dummy worker that throws for every method call.
    if (typeof Worker === 'undefined') {
      return new Proxy(
        {},
        {
          get(_target, _property) {
            return () => {
              throw new Error(
                'You can’t call a method on a worker on the server.',
              );
            };
          },
        },
      ) as any;
    }

    const absoluteScript = new URL(script, window.location.href).href;

    const workerScript = URL.createObjectURL(
      new Blob([`importScripts(${JSON.stringify(absoluteScript)})`]),
    );

    const worker = new Worker(workerScript);
    const endpoint = createEndpoint(worker);
    const {call: caller} = endpoint;

    workerEndpointCache.set(caller, endpoint);

    return caller as any;
  };
}
