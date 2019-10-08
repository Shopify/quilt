import * as Comlink from 'comlink';

import {PromisifyModule} from './types';

export function createWorker<T>(
  module: () => Promise<T>,
): () => PromisifyModule<T> {
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
      new Blob([`importScripts(${JSON.stringify(module)})`]),
    );

    const worker = new Worker(workerScript);
    const workerApi = Comlink.wrap(worker);

    return new Proxy(
      {},
      {
        get(_target, property) {
          return async (...args: any[]) => {
            const requiresProxy = args.some(
              arg => typeof arg === 'function' || typeof arg === 'object',
            );

            // TODO: dont use args[0]
            const parameters = requiresProxy ? Comlink.proxy(args[0]) : args;
            const result = await (workerApi as any)[property](parameters);
            return result;
          };
        },
      },
    ) as any;
  };
}
