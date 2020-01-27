import {
  RETAINED_BY,
  RETAIN_METHOD,
  RELEASE_METHOD,
  FunctionStrategy,
  FunctionStrategyOptions,
} from '../types';
import {StackFrame, isMemoryManageable} from '../memory';

type WireRepresentation = [string, MessagePort?];

const APPLY = 0;
const RESULT = 1;
const RELEASE = 2;
const REVOKE = 3;

export function createChannelFunctionStrategy({
  uuid,
  toWire,
  fromWire,
}: FunctionStrategyOptions): FunctionStrategy<WireRepresentation> {
  const portToFunction = new WeakMap<MessagePort, Function>();
  const functionStore = new Map<Function, [string, MessagePort]>();
  const functionProxies = new Map<string, Function>();

  return {
    toWire(func: Function) {
      if (functionStore.has(func)) {
        const [id] = functionStore.get(func)!;
        return [[id]];
      }

      const id = uuid();
      const {port1, port2} = new MessageChannel();

      functionStore.set(func, [id, port1]);
      portToFunction.set(port1, func);

      port1.addEventListener('message', async function listener({data}) {
        if (data == null) {
          return;
        }

        switch (data[0]) {
          case RELEASE: {
            port1.removeEventListener('message', listener);
            port1.close();
            functionStore.delete(func);
            break;
          }
          case APPLY: {
            const stackFrame = new StackFrame();
            const [, id, args] = data;
            const func = portToFunction.get(port1)!;

            try {
              const retainedBy = isMemoryManageable(func)
                ? [stackFrame, ...func[RETAINED_BY]]
                : [stackFrame];

              const result = await func(
                ...fromWire<unknown[], unknown[]>(args, retainedBy),
              );
              const [serializedResult, transferables] = toWire(result);
              port1.postMessage(
                [RESULT, id, undefined, serializedResult],
                transferables as Transferable[],
              );
            } catch (error) {
              const {name, message, stack} = error;
              port1.postMessage([RESULT, id, {name, message, stack}]);
            } finally {
              stackFrame.release();
            }

            break;
          }
        }
      });

      port1.start();

      return [[id, port2], [port2]];
    },
    fromWire([id, port], retainedBy) {
      if (functionProxies.has(id)) {
        return functionProxies.get(id)!;
      }

      if (port == null) {
        throw new Error('No port provided as a serialization.');
      }

      let retainCount = 0;
      let released = false;
      let revoked = false;

      const release = () => {
        retainCount -= 1;

        if (retainCount === 0) {
          released = true;
          functionProxies.delete(id);
          port.postMessage([RELEASE]);
          port.close();
        }
      };

      const retain = () => {
        retainCount += 1;
      };

      port.addEventListener('message', ({data}) => {
        if (data == null) {
          return;
        }

        switch (data[0]) {
          case REVOKE: {
            revoked = true;
            functionProxies.delete(id);
            port.close();
            break;
          }
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

          const id = uuid();
          const done = new Promise<any>((resolve, reject) => {
            port.addEventListener('message', function listener({data}) {
              if (data == null || data[0] !== RESULT || data[1] !== id) {
                return;
              }

              const [, , errorResult, value] = data;

              port.removeEventListener('message', listener);

              if (errorResult == null) {
                resolve(fromWire(value, retainedBy));
              } else {
                const error = new Error();
                Object.assign(error, errorResult);
                reject(errorResult);
              }
            });
          });

          const [serializedArgs, transferables] = toWire(args);
          port.postMessage(
            [APPLY, id, serializedArgs],
            transferables as Transferable[],
          );

          return done;
        },
      });

      for (const retainer of retainers) {
        retainer.add(proxy as any);
      }

      functionProxies.set(id, proxy);
      port!.start();

      return proxy;
    },
    revoke(value: Function) {
      if (!functionStore.has(value)) {
        throw new Error(
          'You tried to revoke a function that is not currently stored.',
        );
      }

      const [, port] = functionStore.get(value)!;
      port.postMessage([REVOKE]);
      port.close();
      functionStore.delete(value);
      portToFunction.delete(port);
    },
    exchange(value: Function, newValue: Function) {
      if (!functionStore.has(value)) {
        throw new Error(
          'You tried to exchange a value that is not currently stored.',
        );
      }

      const [id, port] = functionStore.get(value)!;
      portToFunction.set(port, newValue);
      functionStore.delete(value);
      functionStore.set(newValue, [id, port]);
    },
    terminate() {
      functionProxies.clear();
      functionStore.clear();
    },
    has(value: Function) {
      return functionStore.has(value);
    },
  };
}
