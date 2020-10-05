import {ChangeEvent} from 'react';
import get from 'get-value';

import {
  Validates,
  Validator,
  FieldOutput,
  FieldBag,
  FormMapping,
  Field,
  FormError,
} from './types';

export function isField<T extends Object>(input: any): input is Field<T> {
  return (
    Object.prototype.hasOwnProperty.call(input, 'value') &&
    Object.prototype.hasOwnProperty.call(input, 'onChange') &&
    Object.prototype.hasOwnProperty.call(input, 'onBlur') &&
    Object.prototype.hasOwnProperty.call(input, 'defaultValue')
  );
}

export function mapObject<Output>(
  input: any,
  mapper: (value: any, key: any) => any,
) {
  return Object.keys(input).reduce((accumulator: any, key) => {
    const value = input[key];
    accumulator[key] = mapper(value, key);
    return accumulator;
  }, {}) as Output;
}

// Eg: set({a: 1}, ['b', 'c'], 2) // => {a: 1, b: {c: 2}}
function setObject<T extends Object>(
  obj: T,
  path: (string | number)[],
  value: any,
): T {
  const [key, ...restPath] = path;
  if (key == null || obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (!restPath.length) {
    obj[key] = value;
    return obj;
  }

  // creates prop if it doesn't exist
  if (typeof obj[key] === 'undefined') {
    // look ahead to the next key. If it is a number, this prop is an array
    obj[key] = typeof restPath[0] === 'number' ? [] : {};
  }

  obj[key] = setObject(obj[key], restPath, value);
  return obj;
}

export function normalizeValidation<Value, Context extends object = {}>(
  input: Validates<Value, Context>,
): Validator<Value, Context>[] {
  return Array.isArray(input) ? input : [input];
}

export function isChangeEvent(
  value: any,
): value is ChangeEvent<HTMLInputElement> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Reflect.has(value, 'target') &&
    Reflect.has(value.target, 'value')
  );
}

export function propagateErrors(
  fieldBag: {[key: string]: FieldOutput<any>},
  errors: FormError[],
) {
  errors.forEach(error => {
    if (error.field == null) {
      return;
    }

    const got = get(fieldBag, error.field);

    if (got && isField(got)) {
      if (got.error !== error.message) {
        got.setError(error.message);
      }
    }
  });
}

// Reduce function similar to Array.reduce() for a tree-like FieldBag
export function reduceFields<V>(
  fieldBag: FieldBag,
  reduceFn: (
    accumulator: V,
    currentField: Field<any>,
    path: (string | number)[],
    fieldBag: FieldBag,
  ) => V,
  initialValue?: V,
  reduceEmptyFn: (
    accumulator: V,
    value: any,
    path: (string | number)[],
    fieldBag: FieldBag,
  ) => V = value => value,
) {
  return (function reduceField(
    accumulator: V,
    item: FieldBag | FieldOutput<any>,
    path: (string | number)[],
  ): V {
    if (isField(item)) {
      return reduceFn(accumulator, item, path, fieldBag);
    }

    if (Array.isArray(item) && item.length) {
      return item.reduce(
        (_accumulator: V, value, index) =>
          reduceField(_accumulator, value, path.concat(index)),
        accumulator,
      );
    }

    if (typeof item === 'object' && item !== null) {
      const entries = Object.entries(item);
      if (entries.length) {
        return entries.reduce(
          (_accumulator: V, [key, value]) =>
            reduceField(_accumulator, value, path.concat(key)),
          accumulator,
        );
      }
    }

    // item is empty array, empty object, or primitive
    return reduceEmptyFn(accumulator, item, path, fieldBag);
  })(initialValue as V, fieldBag, []);
}

export function fieldsToArray(fieldBag: FieldBag) {
  return reduceFields<Field<any>[]>(
    fieldBag,
    (fields, field) => fields.concat(field),
    [],
  );
}

export function validateAll(fieldBag: FieldBag) {
  return reduceFields<FormError[]>(
    fieldBag,
    (errors, field) => {
      const message = field.runValidation();
      return message ? errors.concat({message}) : errors;
    },
    [],
  );
}

export function getValues<T extends FieldBag>(fieldBag: T) {
  return reduceFields<FormMapping<T, 'value'>>(
    fieldBag,
    (formValue, field, path) => setObject(formValue, path, field.value),
    {} as any,
    (formValue, value, path) => setObject(formValue, path, value),
  );
}

export function noop() {}

export function shallowArrayComparison(arrA: unknown[], arrB: any) {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  const len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

export function defaultDirtyComparator<Value>(
  defaultValue: Value,
  newValue: Value,
): boolean {
  return Array.isArray(defaultValue)
    ? !shallowArrayComparison(defaultValue, newValue)
    : defaultValue !== newValue;
}

export function makeCleanFields(fieldBag: FieldBag) {
  reduceFields(fieldBag, (_, field) => field.newDefaultValue(field.value));
}
