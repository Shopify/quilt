import {
  createEndpoint,
  Endpoint,
  MessageEndpoint,
  CreateEndpointOptions,
} from '@remote-ui/rpc';

import {createWorkerMessenger} from '../messenger';

import {createScriptUrl, FileOrModuleResolver} from './utilities';

export interface CreateWorkerOptions<T> extends CreateEndpointOptions<T> {
  createMessenger?(url: URL): MessageEndpoint;
}

export interface WorkerCreator<T> {
  readonly url?: URL;
  (options?: CreateWorkerOptions<T>): Endpoint<T>['call'];
}

const workerEndpointCache = new WeakMap<Endpoint<any>['call'], Endpoint<any>>();

export function createWorkerFactory<T = unknown>(
  script: FileOrModuleResolver<T>,
): WorkerCreator<T> {
  const scriptUrl = createScriptUrl(script);

  function createWorker({
    createMessenger = createWorkerMessenger,
    ...endpointOptions
  }: CreateWorkerOptions<T> = {}): Endpoint<T>['call'] {
    if (scriptUrl) {
      const endpoint = createEndpoint(
        createMessenger(scriptUrl),
        endpointOptions,
      );
      const {call: caller} = endpoint;

      workerEndpointCache.set(caller, endpoint);

      return caller as any;
    }

    // The babel plugin that comes with this package actually turns the argument
    // into a string (the public path of the worker script). If it's a function,
    // it's because we're in an environment where we didn't transform it into a
    // worker. In that case, we can use the fact that we will get access to the
    // real module and pretend to be a worker that way.
    if (typeof script === 'function') {
      return new Proxy(
        {},
        {
          get(_target, property) {
            return async (...args: any[]) => {
              const module = await script();
              return (module as any)[property](...args);
            };
          },
        },
      ) as any;
    }

    // If we aren't in an environment that supports Workers, just bail out
    // with a dummy worker that throws for every method call.
    if (typeof window === 'undefined') {
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

    throw new Error('Could not create a suitable fallback');
  }

  Reflect.defineProperty(createWorker, 'url', {
    value: scriptUrl,
  });

  return createWorker as any;
}

export function expose(
  caller: any,
  api: {[key: string]: (...args: any[]) => any},
) {
  const endpoint = getEndpoint(caller);

  endpoint?.expose(api);

  return endpoint != null;
}

export function terminate(caller: any) {
  const endpoint = getEndpoint(caller);

  endpoint?.terminate();
  workerEndpointCache.delete(caller);

  return endpoint != null;
}

export function getEndpoint<T = unknown>(caller: any): Endpoint<T> | undefined {
  return workerEndpointCache.get(caller);
}
