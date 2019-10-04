import {PromisifyModule} from './types';

export function createWorker<T>(
  script: () => Promise<T>,
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
      new Blob([`importScripts(${JSON.stringify(script)})`]),
    );

    const worker = new Worker(workerScript);

    return new Proxy(
      {},
      {
        get(_target, property) {
          return (...args: any[]) => {
            const done = new Promise<{result: any}>((resolve, reject) => {
              worker.addEventListener('message', function listener({data}) {
                worker.removeEventListener('message', listener);

                if (data.error) {
                  const error = new Error();
                  Object.assign(error, data.error);
                  reject(error);
                } else {
                  resolve(data.result);
                }
              });
            });

            worker.postMessage({invoke: property, args});

            return done;
          };
        },
      },
    ) as any;
  };
}
