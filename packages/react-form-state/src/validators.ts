import {mapObject} from './utilities';

interface Matcher<Input, Fields> {
  (input: Input, fields: Fields): boolean;
}

interface StringMapper {
  (input: string): any;
}

type ErrorContent = string | StringMapper;

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
  // eslint-disable-next-line no-undefined
  return input === null || input === undefined || input.length === 0;
}

export function isEmptyString(input: string) {
  return input.trim().length < 1;
}

export function not<A extends Array<any>, R>(fn: (...a: A) => R) {
  return (...args: A) => !fn(...args);
}

export function validateNested<Input extends Object, Fields>(
  validatorDictionary: any,
) {
  // eslint-disable-next-line consistent-return
  return (input: Input, fields: Fields) => {
    const errors = mapObject<Input, any>(input, (value, field) => {
      const validate = validatorDictionary[field];

      if (validate == null) {
        return null;
      }

      if (typeof validate === 'function') {
        return validate(value, fields);
      }

      if (!Array.isArray(validate)) {
        // eslint-disable-next-line consistent-return
        return;
      }

      const errors = validate
        .map(validator => validator(value, fields))
        .filter(input => input != null);

      if (errors.length === 0) {
        // eslint-disable-next-line consistent-return
        return;
      }
      return errors;
    });

    const anyErrors = Object.keys(errors)
      .map(key => errors[key])
      .some(value => value != null);

    if (anyErrors) {
      return errors;
    }
  };
}

export function validateList<Input extends Object, Fields>(
  validatorDictionary: any,
) {
  const validateItem = validateNested(validatorDictionary);
  // eslint-disable-next-line consistent-return
  return (input: Input[], fields: Fields) => {
    const errors = input.map(item => validateItem(item, fields));

    if (errors.some(error => error != null)) {
      return errors;
    }
  };
}

export function validate<Input>(
  matcher: Matcher<Input, any>,
  errorContent: ErrorContent,
): (input: Input) => ErrorContent | undefined | void;

export function validate<Input, Fields>(
  matcher: Matcher<Input, Fields>,
  errorContent: ErrorContent,
) {
  return (input: Input, fields: Fields) => {
    const matches = matcher(input, fields);

    /*
      always mark empty fields valid to match Polaris guidelines
      https://polaris.shopify.com/patterns/error-messages#section-form-validation
    */
    if (isEmpty(input)) {
      return;
    }

    if (matches) {
      return;
    }

    if (typeof errorContent === 'function') {
      // eslint-disable-next-line consistent-return
      return errorContent(toString(input));
    }

    // eslint-disable-next-line consistent-return
    return errorContent;
  };
}

export function validateRequired<Input>(
  matcher: Matcher<Input, any>,
  errorContent: ErrorContent,
): (input: Input) => ErrorContent | undefined | void;

export function validateRequired<Input, Fields>(
  matcher: Matcher<Input, Fields>,
  errorContent: ErrorContent,
) {
  return (input: Input, fields: Fields) => {
    const matches = matcher(input, fields);

    if (matches) {
      return;
    }

    if (typeof errorContent === 'function') {
      // eslint-disable-next-line consistent-return
      return errorContent(toString(input));
    }

    // eslint-disable-next-line consistent-return
    return errorContent;
  };
}

const validators = {
  lengthMoreThan(length: number, errorContent: ErrorContent) {
    return validate(lengthMoreThan(length), errorContent);
  },

  lengthLessThan(length: number, errorContent: ErrorContent) {
    return validate(lengthLessThan(length), errorContent);
  },

  numericString(errorContent: ErrorContent) {
    return validate(isNumericString, errorContent);
  },

  positiveNumericString(errorContent: ErrorContent) {
    return validate(isPositiveNumericString, errorContent);
  },

  nonNumericString(errorContent: ErrorContent) {
    return validate(not(isNumericString), errorContent);
  },

  requiredString(errorContent: ErrorContent) {
    return validateRequired(not(isEmptyString), errorContent);
  },

  required(errorContent: ErrorContent) {
    return validateRequired(not(isEmpty), errorContent);
  },
};

function toString(obj) {
  if (obj == null) {
    return '';
  }
  return obj.toString();
}

export default validators;
