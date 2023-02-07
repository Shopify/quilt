import isEqual from 'fast-deep-equal';

import {FieldDescriptor} from './types';

export {isEqual};

export function mapObject<Input extends object, Output>(
  input: Input,
  mapper: (value: any, key: string & keyof Input) => any,
) {
  return Object.entries(input).reduce((accumulator: any, [key, value]) => {
    accumulator[key] = mapper(value, key as string & keyof Input);
    return accumulator;
  }, {}) as Output;
}

export function push<T>(array: T[], ...values: T[]) {
  return array.concat(values);
}

export function remove<T>(array: T[], targetIndex: number) {
  return array.filter((_, index) => index !== targetIndex);
}

export function replace<T>(array: T[], targetIndex: number, newValue: T) {
  return array.map((value, index) => {
    if (index !== targetIndex) {
      return value;
    }

    return newValue;
  });
}

export function set<InputType extends object>(
  rootObject: InputType,
  path: string[],
  value: any,
) {
  if (path.length === 0) {
    return rootObject;
  } else if (path.length === 1) {
    return {
      ...(rootObject as any),
      [path[0]]: value,
    };
  } else {
    const [current, ...rest] = path;

    return {
      ...(rootObject as any),
      [current]: set(rootObject[current] || {}, rest, value),
    } as InputType;
  }
}

export function flatMap<T>(
  array: any[],
  mapper: (item: any, index?: number) => T | T[],
): T[] {
  return array.reduce(
    (acc, item, index) => acc.concat(mapper(item, index)),
    [],
  );
}

/**
 * Transforms a boolean FieldDescriptor object to work with checkboxes and radios.
 * @param field
 */
export function asChoiceField({
  value: checked,
  ...fieldData
}: FieldDescriptor<boolean>) {
  return {
    checked,
    ...fieldData,
  };
}

export type ChoiceFieldDescriptor = ReturnType<typeof asChoiceField>;
