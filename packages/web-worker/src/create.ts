import {createEndpoint, Endpoint} from './endpoint';

const workerEndpointCache = new WeakMap<Endpoint<any>['call'], Endpoint<any>>();

export function expose(
  caller: Endpoint<any>['call'],
  api: {[key: string]: Function | undefined},
) {
  const endpoint = workerEndpointCache.get(caller);
  return endpoint && endpoint.expose(api);
}

export function createWorker<T extends {[key: string]: () => Promise<any>}>(
  script: () => Promise<T>,
): () => T {
  return function create() {
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

    const workerScript = URL.createObjectURL(
      new Blob([`importScripts(${JSON.stringify(script)})`]),
    );

    const worker = new Worker(workerScript);
    const endpoint = createEndpoint<T>(worker);
    const {call: caller} = endpoint;

    workerEndpointCache.set(caller, endpoint);

    return caller;
  };
}
