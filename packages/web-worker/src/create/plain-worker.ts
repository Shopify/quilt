import {createWorkerMessenger} from '../messenger';

import {createScriptUrl, FileOrModuleResolver} from './utilities';

export interface PlainWorkerCreator {
  readonly url?: URL;
  (): Worker;
}

export function createPlainWorkerFactory(
  script: FileOrModuleResolver<unknown>,
): PlainWorkerCreator {
  const scriptUrl = createScriptUrl(script);

  function createWorker(): Worker {
    if (scriptUrl) {
      return createWorkerMessenger(scriptUrl);
    }

    // We can’t create a worker without a browser environment,
    // so we return a proxy that just does nothing.
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

  Reflect.defineProperty(createWorker, 'url', {
    value: scriptUrl,
  });

  return createWorker as any;
}
