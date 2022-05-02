import {ValidationError} from '../classes/ValidationError';
import {SchemaValidator, SchemaNode} from '../types';

export {rangeValidator} from './validators/rangeValidator';

/**
 * Function representing the schema validator with `{name: "Presence", ...}`
 *
 * If a value is undefined it returns a ValidationError mentionning the field's translated label
 */
export function presenceValidator(
  val: any,
  options: SchemaValidator,
  node: SchemaNode,
): ValidationError | null {
  return (Array.isArray(val) ? val.length : val)
    ? null
    : new ValidationError('Presence', {
        field: node.translate('label'),
        message: options.message || undefined,
      });
}

function validateRegex(
  val: any,
  format: string,
  message: string | undefined,
  flags = 'i',
): ValidationError | null {
  let exp;
  try {
    exp = new RegExp(format, flags);
  } catch {
    // if we receive garbage or unsupported regex from the server,
    // let's ignore it. The server can always validate on submission.
    return null;
  }
  return exp.test(val)
    ? null
    : new ValidationError('Format', {format, message});
}

interface FormatValidatorOptions {
  format?: string;
  flags?: string;
}

/**
 * Function representing the schema validator with `{name: "Format", ...}`
 * options use that interface
 * ```tsx
 * interface FormatValidatorOptions {
 *   // Valid javascript regex pattern without the surounding slashes ie: "[a-z]"
 *   format?: string;
 *   // normal RegExp flag
 *   flags?: string;
 * }
 * ```
 * example of schema
 * ```json
 * {
 *  "name": "Format",
 *  "format": "0x[a-f]{8}",
 *  "flags": "gim"
 * }
 * ```
 */
export function formatValidator(
  val: any,
  options: SchemaValidator<FormatValidatorOptions>,
  node: SchemaNode,
): ValidationError | null {
  if (!node.context.features.enableFormatValidator) return null;
  if (!options.format || !val) return null;
  if (typeof options.format === 'string') {
    return validateRegex(val, options.format, options.message, options.flags);
  }
  return null;
}

interface LengthValidatorOptions {
  maximum?: number;
  minimum?: number;
  // ! Client don't support this format yet but server could
  // | {
  //     greater_than?: number;
  //     less_than?: number;
  //     allow_nill?: boolean;
  //   };
}

/**
 * Function representing the schema validator with `{name: "Length", ...}`
 *
 * If a value is defined, it tests the content's length based on an optional minimum and/or optional maximum
 */
export function lengthValidator(
  val: string,
  {maximum, minimum, message}: SchemaValidator<LengthValidatorOptions>,
): ValidationError | null {
  const len = val?.length;

  // the lengthValidator should not be a replacement for presenceValidator
  // if no value is passed, let's skip the check in case the value is optional
  if (!len) return null;

  // handle the maximum length
  if (maximum && len > maximum)
    return new ValidationError(`MaximumLength`, {maximum, message});

  // handle the minimum length
  if (minimum && len < minimum)
    return new ValidationError(`MinimumLength`, {minimum, message});

  return null;
}
