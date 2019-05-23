import {
  lengthLessThan,
  lengthMoreThan,
  notEmpty,
  notEmptyString,
  isEmpty,
  notNumericString,
  isNumericString,
  isPositiveNumericString,
} from '@shopify/predicates';
import {mapObject} from './utilities';

interface Matcher<Input, Fields = any> {
  (input: Input, fields: Fields): boolean;
}

interface StringMapper {
  (input: string): any;
}

type ErrorContent = string | StringMapper;

export function validateNested<Input extends object, Fields>(
  validatorDictionary: any,
) {
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
        return;
      }

      const errors = validate
        .map(validator => validator(value, fields))
        .filter(input => input != null);

      if (errors.length === 0) {
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

export function validateList<Input extends object, Fields>(
  validatorDictionary: any,
) {
  const validateItem = validateNested(validatorDictionary);

  return (input: Input[], fields: Fields) => {
    const errors = input.map(item => validateItem(item, fields));

    if (errors.some(error => error != null)) {
      return errors;
    }
  };
}

export function validateWithFields<Input, Fields>(
  matcher: Matcher<Input, Fields>,
  errorContent: ErrorContent,
) {
  return validate(matcher, errorContent) as (
    input: Input,
    fields: Fields,
  ) => ErrorContent | undefined | void;
}

export function validate<Input>(
  matcher: Matcher<Input>,
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
      return errorContent(toString(input));
    }

    return errorContent;
  };
}

export function validateRequired<Input>(
  matcher: Matcher<Input>,
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
      return errorContent(toString(input));
    }

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
    return validate(notNumericString, errorContent);
  },

  requiredString(errorContent: ErrorContent) {
    return validateRequired(notEmptyString, errorContent);
  },

  required(errorContent: ErrorContent) {
    return validateRequired(notEmpty, errorContent);
  },
};

function toString(obj) {
  if (obj == null) {
    return '';
  }
  return obj.toString();
}

export default validators;
