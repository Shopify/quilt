import faker from 'faker';
import {validate, validateNested, validateList, validators} from '..';

describe('validation helpers', () => {
  function trueMatcher() {
    return true;
  }
  function falseMatcher() {
    return false;
  }

  describe('validate', () => {
    it('returns a function that returns void if matcher returns true on its input', () => {
      const error = faker.lorem.word();
      const alwaysPassValidator = validate(trueMatcher, error);
      const alwaysFailValidator = validate(falseMatcher, error);

      const input = faker.lorem.word();
      expect(alwaysPassValidator(input)).toBeUndefined();
      expect(alwaysFailValidator(input)).not.toBeUndefined();
    });

    it('returns a function that returns the errorContent when matcher returns true on its input', () => {
      const error = faker.lorem.word();
      const alwaysPassValidator = validate(trueMatcher, error);
      const alwaysFailValidator = validate(falseMatcher, error);

      const input = faker.lorem.word();
      expect(alwaysPassValidator(input)).toBeUndefined();
      expect(alwaysFailValidator(input)).toBe(error);
    });

    it('returns a function that returns the result of errorContent(input) when matcher returns true on its input and errorContent is a function', () => {
      function error(input: string) {
        return `${input} error`;
      }

      const alwaysPassValidator = validate(trueMatcher, error);
      const alwaysFailValidator = validate(falseMatcher, error);

      const input = faker.lorem.word();
      expect(alwaysPassValidator(input)).toBeUndefined();
      expect(alwaysFailValidator(input)).toBe(error(input));
    });
  });

  describe('validateObject', () => {
    const defaultError = faker.lorem.word();
    const alwaysPassValidator = validate(trueMatcher, defaultError);
    const alwaysFailValidator = validate(falseMatcher, defaultError);

    it('returns a function that returns an error dictionary for validators that fail', () => {
      const compoundValidator = validateNested({
        title: alwaysPassValidator,
        product: alwaysFailValidator,
      });

      const data = {
        title: faker.lorem.words(),
        product: faker.commerce.product(),
      };

      const result = compoundValidator(data, {});

      expect(result).toMatchObject({
        title: alwaysPassValidator(data.title),
        product: alwaysFailValidator(data),
      });
    });

    it('returns a function that returns void when no validator fails', () => {
      const compoundValidator = validateNested({
        title: alwaysPassValidator,
        product: alwaysPassValidator,
      });

      const data = {
        title: faker.lorem.words(),
        product: faker.commerce.product(),
      };

      const result = compoundValidator(data, {});

      expect(result).toBeUndefined();
    });

    it('accepts arrays of validators', () => {
      const compoundValidator = validateNested({
        title: [alwaysPassValidator, alwaysPassValidator, alwaysPassValidator],
        product: [alwaysPassValidator, alwaysFailValidator],
      });

      const data = {
        title: faker.lorem.words(),
        product: faker.commerce.product(),
      };

      const result = compoundValidator(data, {});

      expect(result).toMatchObject({
        title: alwaysPassValidator(data.title),
        product: [alwaysFailValidator(data)],
      });
    });
  });

  describe('validateArray', () => {
    const defaultError = faker.lorem.word();
    const alwaysPassValidator = validate(trueMatcher, defaultError);
    const alwaysFailValidator = validate(falseMatcher, defaultError);

    it('returns a function that returns an array of error dictionaries for any validators that fail', () => {
      const compoundValidator = validateList({
        title: alwaysPassValidator,
        product: alwaysFailValidator,
      });

      const data = [
        {
          title: faker.lorem.words(),
          product: faker.commerce.product(),
        },
        {
          title: faker.lorem.words(),
          product: faker.commerce.product(),
        },
      ];

      const results = compoundValidator(data, {});

      results.forEach((result, index) => {
        expect(result).toMatchObject({
          title: alwaysPassValidator(data[index].title),
          product: alwaysFailValidator(data[index].product),
        });
      });
    });

    it('returns a function that returns void when no item in the array fails any validators', () => {
      const compoundValidator = validateList({
        title: alwaysPassValidator,
        product: alwaysPassValidator,
      });

      const data = [
        {
          title: faker.lorem.words(),
          product: faker.commerce.product(),
        },
        {
          title: faker.lorem.words(),
          product: faker.commerce.product(),
        },
      ];

      const result = compoundValidator(data, {});

      expect(result).toBeUndefined();
    });
  });

  describe('validators', () => {
    describe('lengthMoreThan', () => {
      it('returns a function that returns undefined when input.length > length', () => {
        const error = faker.lorem.word();
        const validator = validators.lengthMoreThan(0, error);
        expect(validator({length: 10})).toBeUndefined();
      });

      it('returns a function that returns errorContent when input.length <= length', () => {
        const error = faker.lorem.word();
        const validator = validators.lengthMoreThan(10, error);
        expect(validator({length: 0})).toBe(error);
      });
    });

    describe('lengthLessThan', () => {
      const error = faker.lorem.word();

      it('returns a function that returns undefined when input.length < length', () => {
        const validator = validators.lengthLessThan(10, error);
        expect(validator({length: 0})).toBeUndefined();
      });

      it('returns a function that returns errorContent when input.length >= length', () => {
        const validator = validators.lengthLessThan(0, error);
        expect(validator({length: 10})).toBe(error);
      });
    });

    describe('numericString', () => {
      const error = faker.lorem.word();

      it('returns a function that returns undefined when the input is a numeric string', () => {
        const validator = validators.numericString(error);
        expect(validator('2')).toBeUndefined();
      });

      it('returns a function that returns errorContent when the input is a non-numeric string', () => {
        const validator = validators.numericString(error);
        expect(validator(faker.lorem.words())).toBe(error);
      });
    });

    describe('nonNumericString', () => {
      const error = faker.lorem.word();

      it('returns a function that returns errorContent when the input is a non-numeric string', () => {
        const validator = validators.numericString(error);
        expect(validator(faker.lorem.words())).toBe(error);
      });

      it('returns a function that returns undefined when the input is a numeric string', () => {
        const validator = validators.numericString(error);
        expect(validator('2')).toBeUndefined();
      });
    });

    describe('required', () => {
      const error = faker.lorem.word();

      it('returns a function that returns errorContent when the input is null', () => {
        const validator = validators.required(error);
        expect(validator(null)).toBe(error);
      });

      it('returns a function that returns errorContent when the input is undefined', () => {
        const validator = validators.required(error);
        // eslint-disable-next-line no-undefined
        expect(validator(undefined)).toBe(error);
      });

      it('returns a function that returns errorContent when the input has a length of 0', () => {
        const validator = validators.required(error);
        expect(validator('')).toBe(error);
      });

      it('returns a function that returns undefined when the input is a non-falsey value with a length > 0', () => {
        const validator = validators.required(error);

        expect(validator([1, 2])).toBeUndefined();
        expect(validator(faker.lorem.words())).toBeUndefined();
        expect(validator({length: 1})).toBeUndefined();
      });
    });

    describe('requiredString', () => {
      const error = faker.lorem.word();

      it('returns a function that returns undefined when the input is not empty', () => {
        const validator = validators.requiredString(error);
        expect(validator(faker.lorem.words())).toBeUndefined();
      });

      it('returns a function that returns errorContent when the input is empty', () => {
        const validator = validators.requiredString(error);
        expect(validator('')).toBe(error);
      });

      it('returns a function that returns errorContent when the input is only whitespace', () => {
        const validator = validators.requiredString(error);
        expect(validator('                      ')).toBe(error);
      });
    });
  });
});
