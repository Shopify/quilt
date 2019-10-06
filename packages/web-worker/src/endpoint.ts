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
const APPLY = '_@a';
const API_ENDPOINT = '_@i';
const APPLY_RESULT = '_@ar';
const APPLY_ERROR = '_@ae';

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
}

interface FunctionSerialization {
  [FUNCTION]: [string, MessagePort?];
}

interface ReleaseMessage {
  [RELEASE]: 1;
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

interface Options {
  uuid?(): string;
}

export interface Endpoint<
  T extends {[key: string]: (...args: any) => Promise<any>} = {}
> {
  call: T;
  expose(api: {[key: string]: Function | undefined}): void;
}

export function createEndpoint<
  T extends {[key: string]: (...args: any) => Promise<any>} = {}
>(
  messageEndpoint: MessageEndpoint,
  {uuid = defaultUuid}: Options = {},
): Endpoint<T> {
  const functionStore = new Map<Function, [string, MessagePort]>();
  const functionProxies = new Map<string, Function>();

  const activeApi = new Map<string, Function>();

  makeCallable(messageEndpoint, (apiCall: ApplyApiEndpoint) =>
    activeApi.get(apiCall[API_ENDPOINT]),
  );

  return {
    call: new Proxy(
      {},
      {
        get(_target, property) {
          return (...args: any[]) => {
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
  };

  function makeCallable(
    messageEndpoint: MessageEndpoint,
    getFunction: ((data: any) => Function | undefined),
  ) {
    messageEndpoint.addEventListener('message', async function listener({
      data,
    }) {
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
    });
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
      functionStore.set(value, [id, port1]);

      port1.addEventListener('message', function listener({data}) {
        if (data && RELEASE in data) {
          port1.removeEventListener('message', listener);
          port1.close();
          functionStore.delete(value);
        }
      });

      makeCallable(port1, () => value);

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
