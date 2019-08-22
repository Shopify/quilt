import faker from 'faker';
import {validator} from '..';

describe('validator', () => {
  it('returns a function that passes if matcher returns true on its input', () => {
    const error = faker.lorem.word();
    const alwaysPassValidator = validator(trueMatcher)(error);
    const alwaysFailValidator = validator(falseMatcher)(error);

    const input = faker.lorem.word();
    expect(alwaysPassValidator(input)).toBeUndefined();
    expect(alwaysFailValidator(input)).not.toBeUndefined();
  });

  it('returns a function that returns the errorContent when matcher returns true on its input', () => {
    const error = faker.lorem.word();
    const alwaysPassValidator = validator(trueMatcher)(error);
    const alwaysFailValidator = validator(falseMatcher)(error);

    const input = faker.lorem.word();
    expect(alwaysPassValidator(input)).toBeUndefined();
    expect(alwaysFailValidator(input)).toBe(error);
  });

  it('returns a function that returns the result of errorContent(input) when matcher returns true on its input and errorContent is a function', () => {
    function error(input: string) {
      return `${input} error`;
    }

    const alwaysPassValidator = validator(trueMatcher)(error);
    const alwaysFailValidator = validator(falseMatcher)(error);

    const input = faker.lorem.word();
    expect(alwaysPassValidator(input)).toBeUndefined();
    expect(alwaysFailValidator(input)).toBe(error(input));
  });

  describe('options.skipOnEmpty', () => {
    it('returns a function which always passes when skipOnEmpty is true and input is empty', () => {
      const alwaysFailValidator = validator(falseMatcher, {skipOnEmpty: true})(
        faker.lorem.words(),
      );

      expect(alwaysFailValidator('')).toBeUndefined();
    });

    it('returns a function which always passes when skipOnEmpty is not specified and input is empty', () => {
      const alwaysFailValidator = validator(falseMatcher)(faker.lorem.words());

      expect(alwaysFailValidator('')).toBeUndefined();
    });

    it('returns a function which fails when the matcher returns a value when skipOnEmpty is false and input is empty', () => {
      const alwaysFailValidator = validator(falseMatcher, {skipOnEmpty: false})(
        faker.lorem.words(),
      );

      expect(alwaysFailValidator('')).not.toBeUndefined();
    });
  });
});

function trueMatcher() {
  return true;
}
function falseMatcher() {
  return false;
}
