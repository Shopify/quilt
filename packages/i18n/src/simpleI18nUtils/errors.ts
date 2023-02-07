import {ReplacementDictionary as Replacements} from './types';

export class MissingTranslationError extends Error {
  constructor(key: string, locale: string) {
    super(`Missing translation for key: ${key} in locale: ${locale}`);
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
        .map((key) => `'${key}'`)
        .join(', ')}`;
    }

    super(errorMessage);
  }
}
