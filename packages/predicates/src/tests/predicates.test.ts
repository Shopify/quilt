import {
  lengthMoreThan,
  lengthLessThan,
  isPositiveNumericString,
  isNumericString,
  isEmpty,
  isEmptyString,
  notEmpty,
  notEmptyString,
  notNumericString,
} from '../predicates';

describe('lengthMoreThan', () => {
  it('returns a function that returns false for inputs with length less than the given value', () => {
    const lengthMoreThanFour = lengthMoreThan(4);

    expect(lengthMoreThanFour('a')).toBe(false);
    expect(lengthMoreThanFour({length: 1})).toBe(false);
    expect(lengthMoreThanFour([1])).toBe(false);
  });

  it('returns a function that returns false for inputs with length equal to the given value', () => {
    const lengthMoreThanTwo = lengthMoreThan(2);

    expect(lengthMoreThanTwo('hi')).toBe(false);
    expect(lengthMoreThanTwo({length: 2})).toBe(false);
    expect(lengthMoreThanTwo([1, 2])).toBe(false);
  });

  it('returns a function that returns true for inputs with length more than the given value', () => {
    const lengthMoreThanThree = lengthMoreThan(3);

    expect(lengthMoreThanThree('I am so very cool')).toBe(true);
    expect(lengthMoreThanThree({length: 10})).toBe(true);
    expect(lengthMoreThanThree([1, 2, 3, 4])).toBe(true);
  });
});

describe('lengthLessThan', () => {
  it('returns a function that returns true for inputs with length less than the given value', () => {
    const lengthLessThanFour = lengthLessThan(4);

    expect(lengthLessThanFour('a')).toBe(true);
    expect(lengthLessThanFour({length: 1})).toBe(true);
    expect(lengthLessThanFour([1])).toBe(true);
  });

  it('returns a function that returns false for inputs with length equal to the given value', () => {
    const lengthLessThanTwo = lengthLessThan(2);

    expect(lengthLessThanTwo('hi')).toBe(false);
    expect(lengthLessThanTwo({length: 2})).toBe(false);
    expect(lengthLessThanTwo([1, 2])).toBe(false);
  });

  it('returns a function that returns false for inputs with length more than the given value', () => {
    const lengthLessThanThree = lengthLessThan(3);

    expect(lengthLessThanThree('I am so very cool')).toBe(false);
    expect(lengthLessThanThree({length: 10})).toBe(false);
    expect(lengthLessThanThree([1, 2, 3, 4])).toBe(false);
  });
});

describe('isPositiveNumericString', () => {
  it('returns false for numeric strings which are negative', () => {
    expect(isPositiveNumericString('-1.00')).toBe(false);
    expect(isPositiveNumericString('-9999')).toBe(false);
  });

  it('returns true for numeric strings which are positive', () => {
    expect(isPositiveNumericString('254')).toBe(true);
    expect(isPositiveNumericString('0.23')).toBe(true);
  });

  it('returns false for non-numeric strings', () => {
    expect(isPositiveNumericString('blorp')).toBe(false);
  });
});

describe('isNumericString', () => {
  it('returns true for numeric strings', () => {
    expect(isNumericString('25499')).toBe(true);
    expect(isNumericString('-0.23')).toBe(true);
    expect(isNumericString('-76')).toBe(true);
    expect(isNumericString('12312312321.123')).toBe(true);
  });

  it('returns false for non-numeric strings', () => {
    expect(isNumericString('lorem ipsum')).toBe(false);
  });
});

describe('notNumericString', () => {
  it('returns false for numeric strings', () => {
    expect(notNumericString('25499')).toBe(false);
    expect(notNumericString('-0.23')).toBe(false);
    expect(notNumericString('-76')).toBe(false);
    expect(notNumericString('12312312321.123')).toBe(false);
  });

  it('returns true for non-numeric strings', () => {
    expect(notNumericString('lorem ipsum')).toBe(true);
  });
});

describe('isEmptyString', () => {
  it('returns true for empty strings', () => {
    expect(isEmptyString('')).toBe(true);
  });

  it('returns true for strings with only whitespace', () => {
    expect(isEmptyString(' ')).toBe(true);
    expect(isEmptyString('\t')).toBe(true);
    expect(isEmptyString('\n\n')).toBe(true);
  });

  it('returns false for strings with non-whitespace characters', () => {
    expect(isEmptyString('foo bar baz')).toBe(false);
  });
});

describe('notEmptyString', () => {
  it('returns false for empty strings', () => {
    expect(notEmptyString('')).toBe(false);
  });

  it('returns false for strings with only whitespace', () => {
    expect(notEmptyString(' ')).toBe(false);
    expect(notEmptyString('\t')).toBe(false);
    expect(notEmptyString('\n\n')).toBe(false);
  });

  it('returns true for strings with non-whitespace characters', () => {
    expect(notEmptyString('foo bar baz')).toBe(true);
  });
});

describe('isEmpty', () => {
  it('returns true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('returns true for values with a `length` property of 0', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({length: 0})).toBe(true);
    expect(isEmpty('')).toBe(true);
  });

  it('returns false for values with a non-zero `length` property', () => {
    expect(isEmpty([1, 2])).toBe(false);
    expect(isEmpty({length: 1})).toBe(false);
    expect(isEmpty('oh hi, mark')).toBe(false);
  });

  it('returns false for objects that do not have a length property', () => {
    expect(isEmpty({foo: 'bar'})).toBe(false);
  });
});

describe('notEmpty', () => {
  it('returns false for null', () => {
    expect(notEmpty(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(notEmpty(undefined)).toBe(false);
  });

  it('returns false for values with a `length` property of 0', () => {
    expect(notEmpty([])).toBe(false);
    expect(notEmpty({length: 0})).toBe(false);
    expect(notEmpty('')).toBe(false);
  });

  it('returns true for values with a non-zero `length` property', () => {
    expect(notEmpty([1, 2])).toBe(true);
    expect(notEmpty({length: 1})).toBe(true);
    expect(notEmpty('oh hi, mark')).toBe(true);
  });

  it('returns true for objects that do not have a length property', () => {
    expect(notEmpty({foo: 'bar'})).toBe(true);
  });
});
