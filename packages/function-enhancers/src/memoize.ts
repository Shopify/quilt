interface MemoizeMap<T, U> {
  get(key: T): U;
  has(key: T): boolean;
  set(key: T, value: U): MemoizeMap<T, U>;
}

export const MAX_MAP_ENTRIES = 50;

export default function memoize<
  Method extends (this: unknown, ...args: any[]) => any,
>(method: Method, resolver?: (...args: Parameters<Method>) => any): Method {
  const weakMapCache = new WeakMap();
  const mapCache = new Map();
  const mapKeys: any[] = [];

  return function memoized(...args: Parameters<Method>) {
    if (typeof window === 'undefined') {
      return method.apply(this, args);
    }

    const useWeakMap =
      args.length === 1 && typeof args[0] === 'object' && !resolver;

    let key;
    if (useWeakMap) {
      key = args[0];
    } else if (resolver && resolver instanceof Function) {
      key = resolver(...args);
    } else {
      key = args[0];
    }

    const cache: MemoizeMap<any, any> = useWeakMap ? weakMapCache : mapCache;
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = method.apply(this, args);

    if (useWeakMap) {
      weakMapCache.set(key, result);
    } else {
      mapCache.set(key, result);
      mapKeys.push(key);

      if (mapCache.size > MAX_MAP_ENTRIES) {
        const oldestKey = mapKeys[0];
        mapCache.delete(oldestKey);
        mapKeys.shift();
      }
    }

    return result;
  } as Method;
}
