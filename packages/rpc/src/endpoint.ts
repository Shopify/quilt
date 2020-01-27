import {
  MessageEndpoint,
  RemoteCallable,
  FunctionStrategy,
  FunctionStrategyOptions,
} from './types';
import {Retainer, StackFrame} from './memory';
import {createMessengerFunctionStrategy} from './strategies';

const APPLY = 0;
const RESULT = 1;
const TERMINATE = 2;

const FUNCTION = '_@f';

interface Options {
  uuid?(): string;
  createFunctionStrategy?(
    options: FunctionStrategyOptions,
  ): FunctionStrategy<unknown>;
}

export interface Endpoint<T> {
  readonly call: RemoteCallable<T>;
  readonly functions: FunctionStrategy<unknown>;
  replace(messenger: MessageEndpoint): void;
  expose(api: {[key: string]: Function | undefined}): void;
  terminate(): void;
}

export function createEndpoint<T>(
  initialMessenger: MessageEndpoint,
  {
    uuid = defaultUuid,
    createFunctionStrategy = createMessengerFunctionStrategy,
  }: Options = {},
): Endpoint<T> {
  let terminated = false;
  let messenger = initialMessenger;
  const eventListeners = new Set<Function>();

  const functions = createFunctionStrategy({
    uuid,
    toWire,
    fromWire,
    messenger: {
      postMessage: (...args) => messenger.postMessage(...args),
      addEventListener: (_, listener) => {
        eventListeners.add(listener);
      },
      removeEventListener: (_, listener) => {
        eventListeners.delete(listener);
      },
    },
  });

  const activeApi = new Map<string, Function>();

  function terminate() {
    terminated = true;
    activeApi.clear();
    messenger.removeEventListener('message', listener);

    if (functions.terminate != null) {
      functions.terminate();
    }
  }

  async function listener(event: MessageEvent) {
    for (const listener of [...eventListeners]) {
      listener(event);
    }

    const {data} = event;

    if (data == null) {
      return;
    }

    switch (data[0]) {
      case TERMINATE: {
        terminate();
        break;
      }
      case APPLY: {
        const stackFrame = new StackFrame();
        const [, id, target, args] = data;
        const func = activeApi.get(target);

        try {
          if (func == null) {
            throw new Error(
              `No '${target}' method is exposed on this endpoint`,
            );
          }

          const result = await func(...fromWire(args, [stackFrame]));
          const [serializedResult, transferables] = toWire(result);
          messenger.postMessage(
            [RESULT, id, undefined, serializedResult],
            transferables,
          );
        } catch (error) {
          const {name, message, stack} = error;
          messenger.postMessage([RESULT, id, {name, message, stack}]);
        } finally {
          stackFrame.release();
        }

        break;
      }
    }
  }

  messenger.addEventListener('message', listener);

  return {
    call: new Proxy(
      {},
      {
        get(_target, property) {
          return (...args: any[]) => {
            if (terminated) {
              throw new Error(
                'You attempted to call a function on a terminated web worker.',
              );
            }

            const id = uuid();
            const done = new Promise<any>((resolve, reject) => {
              messenger.addEventListener('message', function listener({data}) {
                if (data == null || data[0] !== RESULT || data[1] !== id) {
                  return;
                }

                messenger.removeEventListener('message', listener);

                const [, , errorResult, value] = data;

                if (errorResult == null) {
                  resolve(fromWire(value));
                } else {
                  const error = new Error();
                  Object.assign(error, errorResult);
                  reject(error);
                }
              });
            });

            const [serializedArgs, transferables] = toWire(args);
            messenger.postMessage(
              [APPLY, id, property, serializedArgs],
              transferables,
            );

            return done;
          };
        },
      },
    ) as any,
    functions,
    replace(newMessenger) {
      const oldMessenger = messenger;
      messenger = newMessenger;

      oldMessenger.removeEventListener('message', listener);
      newMessenger.addEventListener('message', listener);
    },
    expose(api) {
      for (const key of Object.keys(api)) {
        const value = api[key];

        if (typeof value === 'function') {
          activeApi.set(key, value);
        } else {
          activeApi.delete(key);
        }
      }
    },
    terminate() {
      terminate();

      if (messenger.terminate) {
        messenger.terminate();
      } else {
        messenger.postMessage([TERMINATE]);
      }
    },
  };

  function toWire(value: unknown): [any, Transferable[]?] {
    if (typeof value === 'object') {
      if (value == null) {
        return [value];
      }

      const transferables: Transferable[] = [];

      if (Array.isArray(value)) {
        const result = value.map(item => {
          const [result, nestedTransferables = []] = toWire(item);
          transferables.push(...nestedTransferables);
          return result;
        });

        return [result, transferables];
      }

      const result = Object.keys(value).reduce((object, key) => {
        const [result, nestedTransferables = []] = toWire(value[key]);
        transferables.push(...nestedTransferables);
        return {...object, [key]: result};
      }, {});

      return [result, transferables];
    }

    if (typeof value === 'function') {
      const [result, transferables] = functions.toWire(value);
      return [{[FUNCTION]: result}, transferables];
    }

    return [value];
  }

  function fromWire(value: unknown, retainedBy: Retainer[] = []) {
    if (typeof value === 'object') {
      if (value == null) {
        return value;
      }

      if (Array.isArray(value)) {
        return value.map(value => fromWire(value, retainedBy));
      }

      if (value[FUNCTION]) {
        return functions.fromWire(value[FUNCTION], retainedBy);
      }

      return Object.keys(value).reduce(
        (object, key) => ({...object, [key]: fromWire(value[key], retainedBy)}),
        {},
      );
    }

    return value;
  }
}

function defaultUuid() {
  return `${uuidSegment()}-${uuidSegment()}-${uuidSegment()}-${uuidSegment()}`;
}

function uuidSegment() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
}
