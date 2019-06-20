import * as predicates from '@shopify/predicates';
import {ErrorContent, validator} from './validator';

export function lengthMoreThan(length, error: ErrorContent<string>) {
  return validator(predicates.lengthMoreThan(length))(error);
}

export function lengthLessThan(length: number, error: ErrorContent<string>) {
  return validator(predicates.lengthLessThan(length))(error);
}

export function notEmpty(error: ErrorContent<string>) {
  return validator(predicates.notEmpty, {skipOnEmpty: false})(error);
}

export function notEmptyString(error: ErrorContent<string>) {
  return validator(predicates.notEmptyString, {skipOnEmpty: false})(error);
}

export function positiveIntegerString(error: ErrorContent<string>) {
  return validator(predicates.isPositiveIntegerString)(error);
}

export function positiveNumericString(error: ErrorContent<string>) {
  return validator(predicates.isPositiveNumericString)(error);
}

export function numericString(error: ErrorContent<string>) {
  return validator(predicates.isNumericString)(error);
}
