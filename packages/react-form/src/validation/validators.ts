import {ErrorContent, validator} from './validator';
import * as predicates from './predicates';

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
  return validator(predicates.notEmptyString)(error);
}

export function positiveNumericString(error: ErrorContent<string>) {
  return validator(input => {
    return input !== '' && (input.match(/[^0-9.,]/g) || []).length === 0;
  })(error);
}

export function numericString(error: ErrorContent<string>) {
  return validator(input => {
    return input !== '' && (input.match(/[^0-9.,-]/g) || []).length === 0;
  })(error);
}
