import {memoize as memoizeEnhancer} from '@shopify/function-enhancers';

export default function memoize<Method extends (...args: any[]) => any>(
  resolver?: (...args: Parameters<Method>) => any,
): MethodDecorator {
  return function <T>(
    _target: object,
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
