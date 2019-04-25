import {ChangeEvent} from 'react';
import {Validates, FieldOutput, Field, Validator} from './types';

export function isField<T extends object>(
  input: FieldOutput<T>,
): input is Field<T> {
  return (
    input.hasOwnProperty('value') &&
    input.hasOwnProperty('onChange') &&
    input.hasOwnProperty('onBlur') &&
    input.hasOwnProperty('defaultValue')
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
    Reflect.has(value, 'target') &&
    Reflect.has(value.target, 'value')
  );
}

export function noop() {}
