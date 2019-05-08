import {ChangeEvent} from 'react';

import get from 'get-value';

import {
  Validates,
  Validator,
  FieldOutput,
  FieldDictionary,
  Field,
  FormError,
} from './types';

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

export function propagateErrors(
  fieldBag: {[key: string]: FieldOutput<any>},
  errors: FormError[],
) {
  errors.forEach(error => {
    if (error.field == null) {
      return;
    }

    const got = get(fieldBag, error.field);

    if (isField(got)) {
      if (got.error !== error.message) {
        got.setError(error.message);
      }
    }
  });
}

export function validateAll(fieldBag: {[key: string]: FieldOutput<any>}) {
  const fields = Object.values(fieldBag);
  const errors: FormError[] = [];

  function validate(field: Field<unknown>) {
    const message = field.runValidation();
    if (message) {
      errors.push({message});
    }
  }

  function validateDictionary(fields: FieldDictionary<any>) {
    Object.values(fields).forEach(validate);
  }

  for (const item of fields) {
    if (isField(item)) {
      validate(item);
    } else if (Array.isArray(item)) {
      item.map(validateDictionary);
    } else {
      validateDictionary(item);
    }
  }

  return errors;
}

export function noop() {}
