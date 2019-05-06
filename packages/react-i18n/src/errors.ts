import {Replacements} from './types';

export class MissingTranslationError extends Error {
  constructor(key: string) {
    super(`Missing translation for key: ${key}`);
  }
}
export class MissingReplacementError extends Error {
  constructor(replacement: string, replacements: Replacements = {}) {
    let errorMessage = '';
    const replacementKeys = Object.keys(replacements);

    if (replacementKeys.length < 1) {
      errorMessage = `No replacement found for key '${replacement}' (and no replacements were passed in).`;
    } else {
      errorMessage = `No replacement found for key '${replacement}'. The following replacements were passed: ${replacementKeys
        .map(key => `'${key}'`)
        .join(', ')}`;
    }

    super(errorMessage);
  }
}
export class MissingCurrencyCodeError extends Error {
  constructor(additionalMessage = '') {
    const baseErrorMessage = 'No currency code provided.';
    super(
      additionalMessage === ''
        ? baseErrorMessage
        : `${baseErrorMessage} ${additionalMessage}`,
    );
  }
}
export class MissingCountryError extends Error {
  constructor(additionalMessage = '') {
    const baseErrorMessage = 'No country code provided.';
    super(
      additionalMessage === ''
        ? baseErrorMessage
        : `${baseErrorMessage} ${additionalMessage}`,
    );
  }
}

export type I18nError =
  | MissingTranslationError
  | MissingReplacementError
  | MissingCurrencyCodeError
  | MissingCountryError;
