export function lengthMoreThan(length: number) {
  return (input: {length: number}) => input.length > length;
}

export function lengthLessThan(length: number) {
  return (input: {length: number}) => input.length < length;
}

export function isPositiveNumericString(input: string) {
  return input !== '' && (input.match(/[^0-9.,]/g) || []).length === 0;
}

export function isNumericString(input: string) {
  return input !== '' && (input.match(/[^0-9.,-]/g) || []).length === 0;
}

export function isEmpty(input: any) {
  return input === null || input === undefined || input.length === 0;
}

export function isEmptyString(input: string) {
  return input.trim().length < 1;
}

export function notEmpty(input: string) {
  return not(isEmpty)(input);
}

export function notEmptyString(input: string) {
  return not(isEmptyString)(input);
}

function not<A extends any[], R>(fn: (...xs: A) => R) {
  return (...args: A) => !fn(...args);
}
