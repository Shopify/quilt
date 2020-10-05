import {
  RETAINED_BY,
  RETAIN_METHOD,
  RELEASE_METHOD,
  FunctionStrategy,
  FunctionStrategyOptions,
} from '../types';
import {StackFrame, isMemoryManageable} from '../memory';

type WireRepresentation = string;

const APPLY = 11;
const RESULT = 12;
const RELEASE = 13;
const REVOKE = 14;

export function createMessengerFunctionStrategy({
  uuid,
  toWire,
  fromWire,
  messenger,
}: FunctionStrategyOptions): FunctionStrategy<WireRepresentation> {
  const functionsToId = new Map<Function, string>();
  const idsToFunction = new Map<string, Function>();
  const idsToProxy = new Map<string, Function>();

  const callIdsToResolver = new Map<
    string,
    (error: Error | undefined, result: any) => void
  >();

  async function listener({data}: MessageEvent) {
    if (data == null) {
      return;
    }

    switch (data[0]) {
      case REVOKE: {
        const [, id] = data;
        idsToProxy.delete(id);
        break;
      }
      case RELEASE: {
        const [, id] = data;
        const func = idsToFunction.get(id);

        if (func) {
          idsToFunction.delete(id);
          functionsToId.delete(func);
        }

        break;
      }
      case RESULT: {
        const [, callId, error, result] = data;
        callIdsToResolver.get(callId)!(error, result);
        callIdsToResolver.delete(callId);
        break;
      }
      case APPLY: {
        const stackFrame = new StackFrame();
        const [, callId, funcId, args] = data;
        const func = idsToFunction.get(funcId);

        if (func == null) {
          const {name, message, stack} = new Error(
            'You attempted to call a function that was already revoked.',
          );
          messenger.postMessage([RESULT, callId, {name, message, stack}]);
          return;
        }

        try {
          const retainedBy = isMemoryManageable(func)
            ? [stackFrame, ...func[RETAINED_BY]]
            : [stackFrame];

          const result = await func(
            ...fromWire<unknown[], unknown[]>(args, retainedBy),
          );
          const [serializedResult, transferables] = toWire(result);
          messenger.postMessage(
            [RESULT, callId, undefined, serializedResult],
            transferables,
          );
        } catch (error) {
          const {name, message, stack} = error;
          messenger.postMessage([RESULT, callId, {name, message, stack}]);
        } finally {
          stackFrame.release();
        }

        break;
      }
    }
  }

  messenger.addEventListener('message', listener);

  return {
    toWire(func: Function) {
      if (functionsToId.has(func)) {
        const id = functionsToId.get(func)!;
        return [id];
      }

      const id = uuid();

      functionsToId.set(func, id);
      idsToFunction.set(id, func);

      return [id];
    },
    fromWire(id, retainedBy) {
      if (idsToProxy.has(id)) {
        return idsToProxy.get(id)!;
      }

      let retainCount = 0;
      let released = false;

      const release = () => {
        retainCount -= 1;

        if (retainCount === 0) {
          released = true;
          idsToProxy.delete(id);
          messenger.postMessage([RELEASE, id]);
        }
      };

      const retain = () => {
        retainCount += 1;
      };

      const retainers = new Set(retainedBy);

      const proxy = new Proxy(function () {}, {
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

          if (!idsToProxy.has(id)) {
            throw new Error(
              'You attempted to call a function that was already revoked.',
            );
          }

          const callId = uuid();

          const done = new Promise<any>((resolve, reject) => {
            callIdsToResolver.set(callId, (errorResult, value) => {
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
          messenger.postMessage(
            [APPLY, callId, id, serializedArgs],
            transferables,
          );

          return done;
        },
      });

      for (const retainer of retainers) {
        retainer.add(proxy as any);
      }

      idsToProxy.set(id, proxy);

      return proxy;
    },
    revoke(value: Function) {
      if (!functionsToId.has(value)) {
        throw new Error(
          'You tried to revoke a function that is not currently stored.',
        );
      }

      const id = functionsToId.get(value)!;
      functionsToId.delete(value);
      idsToFunction.delete(id);
    },
    exchange(value: Function, newValue: Function) {
      if (!functionsToId.has(value)) {
        throw new Error(
          'You tried to exchange a value that is not currently stored.',
        );
      }

      const id = functionsToId.get(value)!;
      idsToFunction.set(id, newValue);
      functionsToId.delete(value);
      functionsToId.set(newValue, id);
    },
    terminate() {
      functionsToId.clear();
      idsToFunction.clear();
      idsToProxy.clear();
      callIdsToResolver.clear();
      messenger.removeEventListener('message', listener);
    },
    has(value: Function) {
      return functionsToId.has(value);
    },
  };
}
