import {memoize as memoizeEnhancer} from '@shopify/function-enhancers';

export type Resolver<T extends Function> = T;

export default function memoize<Method extends Function>(
  resolver?: Resolver<Method>,
): MethodDecorator {
  return function<T>(
    _target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const {value: method} = descriptor;

    if (!method || !(method instanceof Function)) {
      return descriptor;
    }

    return {
      get: function get() {
        const newDescriptor = {
          configurable: true,
          value: memoizeEnhancer(method as any, resolver),
        };

        Object.defineProperty(this, propertyKey, newDescriptor);
        return newDescriptor.value;
      },
    };
  };
}
