export function lengthMoreThan(length: number) {
  return (input: {length: number}) => input.length > length;
}

export function lengthLessThan(length: number) {
  return (input: {length: number}) => input.length < length;
}

export function isPositiveIntegerString(input: string) {
  return input !== '' && (input.match(/[^0-9]/g) || []).length === 0;
}

export function isPositiveNumericString(input: string) {
  return input !== '' && (input.match(/[^0-9.,]/g) || []).length === 0;
}

export function isNumericString(input: string) {
  return input !== '' && (input.match(/[^0-9.,-]/g) || []).length === 0;
}

export function isURL(input: string) {
  if (!input) return false;

  const urlRegex = new RegExp(
    // protocol
    '^(https?:\\/\\/)?' +
      // domain name
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      // OR ip (v4) address
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      // port and path
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      // query string
      '(\\?[;&a-z\\d%_.~+=\\-\\[\\]]*)?' +
      // fragment locator
      '(\\#[-a-z\\d_]*)?$',
    'i',
  );
  return urlRegex.test(input);
}

export function isSecureURL(input: string) {
  const secureUrlRegex = /^https:\/\//i;
  return isURL(input) && secureUrlRegex.test(input);
}

export function isEmpty(input: any) {
  return input === null || input === undefined || input.length === 0;
}

export function isEmptyString(input: string) {
  return input === null || input === undefined || input.trim().length < 1;
}

export function notEmpty(input: any) {
  return not(isEmpty)(input);
}

export function notEmptyString(input: string) {
  return not(isEmptyString)(input);
}

export function notNumericString(input: string) {
  return not(isNumericString)(input);
}

function not<A extends any[], R>(fn: (...xs: A) => R) {
  return (...args: A) => !fn(...args);
}
