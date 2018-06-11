export interface IsType<T> {
  (val: any): val is T;
}

export type FieldMatchers<T> = {[P in keyof T]: IsType<T[P]>};

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isObject(value: any): value is object {
  return typeof value === 'object';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isNull(value: any): value is null {
  return value == null;
}

export function isTruthy(value: any): value is true {
  return Boolean(value);
}

export function isKey<E>(expected: E) {
  return (value: any): value is E => {
    return value === expected;
  };
}

export function isShape<T>(matchers: FieldMatchers<T>): IsType<T> {
  return function check(object: any): object is T {
    if (!isObject(object)) {
      return false;
    }

    for (const key of Object.keys(matchers)) {
      const matcher = matchers[key];
      const value = object[key];

      if (!matcher(value)) {
        return false;
      }
    }

    return true;
  };
}
