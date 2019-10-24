import {PromisifyModule} from './types';

import {
  RETAIN_METHOD,
  RELEASE_METHOD,
  RETAINED_BY,
  Retainer,
  MemoryManageable,
  isMemoryManageable,
} from './memory';

const ID = '_';
const FUNCTION = '_@f';
const RELEASE = '_@r';
const REVOKE = '_@v';
const APPLY = '_@a';
const API_ENDPOINT = '_@i';
const APPLY_RESULT = '_@ar';
const APPLY_ERROR = '_@ae';
const TERMINATE = '_@t';

class StackFrame {
  private readonly memoryManaged = new Set<MemoryManageable>();

  add(memoryManageable: MemoryManageable) {
    this.memoryManaged.add(memoryManageable);
    memoryManageable[RETAINED_BY].add(this);
    memoryManageable[RETAIN_METHOD]();
  }

  release() {
    for (const memoryManaged of this.memoryManaged) {
      memoryManaged[RETAINED_BY].delete(this);
      memoryManaged[RELEASE_METHOD]();
    }

    this.memoryManaged.clear();
  }
}

interface MessageEndpoint {
  postMessage(message: any, transferables?: Transferable[]): void;
  addEventListener(
    event: 'message',
    listener: (event: MessageEvent) => void,
  ): void;
  removeEventListener(
    event: 'message',
    listener: (event: MessageEvent) => void,
  ): void;
  terminate?(): void;
}

interface FunctionSerialization {
  [FUNCTION]: [string, MessagePort?];
}

interface ReleaseMessage {
  [RELEASE]: 1;
}

interface RevokeMessage {
  [REVOKE]: 1;
}

interface ApplyMessage {
  [APPLY]: any[];
}

interface ApplyApiEndpoint extends ApplyMessage {
  [API_ENDPOINT]: string;
}

interface ApplyResultMessage {
  [APPLY_RESULT]: any;
}

interface ApplyErrorMessage {
  [APPLY_ERROR]: {name: string; message: string; stack?: string};
}

interface TerminateMessage {
  [TERMINATE]: 1;
}

interface Options {
  uuid?(): string;
}

export interface Endpoint<T> {
  call: PromisifyModule<T>;
  expose(api: {[key: string]: Function | undefined}): void;
  revoke(value: Function): void;
  exchange(value: Function, newValue: Function): void;
  terminate(): void;
}

export function createEndpoint<T>(
  messageEndpoint: MessageEndpoint,
  {uuid = defaultUuid}: Options = {},
): Endpoint<T> {
  let terminated = false;
  const functionStore = new Map<Function, [string, MessagePort]>();
  const functionProxies = new Map<string, Function>();
  const removeListeners = new WeakMap<MessageEndpoint, () => void>();
  const activeApi = new Map<string, Function>();

  makeCallable(messageEndpoint, (apiCall: ApplyApiEndpoint) =>
    activeApi.get(apiCall[API_ENDPOINT]),
  );

  messageEndpoint.addEventListener('message', ({data}) => {
    if (TERMINATE in data) {
      [functionStore, functionProxies, activeApi].forEach(map => map.clear());
      terminated = true;
    }
  });

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

            return call(messageEndpoint, args, [], {[API_ENDPOINT]: property});
          };
        },
      },
    ) as any,
    expose(api: {[key: string]: Function | undefined}) {
      for (const key of Object.keys(api)) {
        const value = api[key];

        if (typeof value === 'function') {
          activeApi.set(key, value);
        } else {
          activeApi.delete(key);
        }
      }
    },
    revoke(value: Function) {
      if (!functionStore.has(value)) {
        throw new Error(
          'You tried to revoke a function that is not currently stored.',
        );
      }

      const [, port] = functionStore.get(value)!;
      port.postMessage({[REVOKE]: 1} as RevokeMessage);
      port.close();
      functionStore.delete(value);
    },
    exchange(value: Function, newValue: Function) {
      if (!functionStore.has(value)) {
        throw new Error(
          'You tried to exchange a value that is not currently stored.',
        );
      }

      const [id, port] = functionStore.get(value)!;
      makeCallable(port, () => newValue);
      functionStore.set(newValue, [id, port]);
    },
    terminate() {
      [functionStore, functionProxies, activeApi].forEach(map => map.clear());
      terminated = true;

      if (messageEndpoint.terminate) {
        messageEndpoint.terminate();
      } else {
        messageEndpoint.postMessage({[TERMINATE]: 1} as TerminateMessage);
      }
    },
  };

  function makeCallable(
    messageEndpoint: MessageEndpoint,
    getFunction: (data: any) => Function | undefined,
  ) {
    const remove = removeListeners.get(messageEndpoint);

    if (remove) {
      remove();
    }

    async function listener({data}) {
      if (!(APPLY in data)) {
        return;
      }

      const stackFrame = new StackFrame();

      try {
        const func = getFunction(data)!;
        const retainedBy = isMemoryManageable(func)
          ? [stackFrame, ...func[RETAINED_BY]]
          : [stackFrame];

        const result = await func(...fromWire(data[APPLY], retainedBy));
        const [serializedResult, transferables] = toWire(result);
        messageEndpoint.postMessage(
          {[ID]: data[ID], [APPLY_RESULT]: serializedResult},
          transferables,
        );
      } catch (error) {
        const {name, message, stack} = error;
        messageEndpoint.postMessage({
          [ID]: data[ID],
          [APPLY_ERROR]: {name, message, stack},
        });
      } finally {
        stackFrame.release();
      }
    }

    messageEndpoint.addEventListener('message', listener);
    removeListeners.set(messageEndpoint, () =>
      messageEndpoint.removeEventListener('message', listener),
    );
  }

  function call(
    messageEndpoint: MessageEndpoint,
    args: any[],
    retainedBy: Retainer[] = [],
    message: object = {},
  ) {
    const id = uuid();
    const done = new Promise((resolve, reject) => {
      messageEndpoint.addEventListener('message', function listener({data}) {
        if (data == null || data[ID] !== id) {
          return;
        }

        messageEndpoint.removeEventListener('message', listener);

        if (APPLY_ERROR in data) {
          const error = new Error();
          Object.assign(error, (data as ApplyErrorMessage)[APPLY_ERROR]);
          reject(error);
        } else {
          resolve(
            fromWire((data as ApplyResultMessage)[APPLY_RESULT], retainedBy),
          );
        }
      });
    });

    const [serializedArgs, transferables] = toWire(args);
    messageEndpoint.postMessage(
      {
        [ID]: id,
        [APPLY]: serializedArgs,
        ...message,
      } as ApplyMessage,
      transferables,
    );

    return done;
  }

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
      if (functionStore.has(value)) {
        const [id] = functionStore.get(value)!;
        return [{[FUNCTION]: [id]} as FunctionSerialization];
      }

      const id = uuid();
      const {port1, port2} = new MessageChannel();
      makeCallable(port1, () => value);
      functionStore.set(value, [id, port1]);

      port1.addEventListener('message', function listener({data}) {
        if (data && RELEASE in data) {
          port1.removeEventListener('message', listener);
          port1.close();
          functionStore.delete(value);
        }
      });

      port1.start();

      return [{[FUNCTION]: [id, port2]} as FunctionSerialization, [port2]];
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
        const [id, port] = (value as FunctionSerialization)[FUNCTION];

        if (functionProxies.has(id)) {
          return functionProxies.get(id)!;
        }

        let retainCount = 0;
        let released = false;
        let revoked = false;

        const release = () => {
          retainCount -= 1;

          if (retainCount === 0) {
            released = true;
            functionProxies.delete(id);
            port!.postMessage({[RELEASE]: 1} as ReleaseMessage);
            port!.close();
          }
        };

        const retain = () => {
          retainCount += 1;
        };

        port!.addEventListener('message', ({data}) => {
          if (data && data[REVOKE]) {
            revoked = true;
            functionProxies.delete(id);
            port!.close();
          }
        });

        const retainers = new Set(retainedBy);

        const proxy = new Proxy(function() {}, {
          get(target, prop, receiver) {
            if (prop === 'apply' || prop === 'bind') {
              return receiver;
            }

            if (prop === RELEASE_METHOD) {
              return release;
            }

            if (prop === RETAIN_METHOD) {
              return retain;
            }

            if (prop === RETAINED_BY) {
              return retainers;
            }

            return Reflect.get(target, prop, receiver);
          },
          apply(_target, _this, args) {
            if (released) {
              throw new Error(
                'You attempted to call a function that was already released.',
              );
            }

            if (revoked) {
              throw new Error(
                'You attempted to call a function that was already revoked.',
              );
            }

            return call(port!, args, retainedBy);
          },
        });

        for (const retainer of retainers) {
          retainer.add(proxy as any);
        }

        functionProxies.set(id, proxy);
        port!.start();

        return proxy;
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
