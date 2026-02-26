import * as React from 'react';
import {
  TranslationDictionary,
  ComplexReplacementDictionary,
  PrimitiveReplacementDictionary,
} from './types';
import {MissingTranslationError, MissingReplacementError} from './errors';

const REPLACE_REGEX = /{([^}]*)}/g;
const MISSING_TRANSLATION = Symbol('Missing translation');
const PLURALIZATION_KEY_NAME = 'count';
const SEPARATOR = '.';

export interface TranslateOptions<
  Replacements extends
    | PrimitiveReplacementDictionary
    | ComplexReplacementDictionary
> {
  scope?: string | string[];
  replacements?: Replacements;
}

export function translate(
  id: string,
  options: TranslateOptions<PrimitiveReplacementDictionary>,
  translations: TranslationDictionary | TranslationDictionary[],
  locale: string,
): string;
export function translate(
  id: string,
  options: TranslateOptions<ComplexReplacementDictionary>,
  translations: TranslationDictionary | TranslationDictionary[],
  locale: string,
): (string | React.ReactElement<any>)[];
export function translate(
  id: string,
  options: TranslateOptions<
    PrimitiveReplacementDictionary | ComplexReplacementDictionary
  >,
  translations: TranslationDictionary | TranslationDictionary[],
  locale: string,
): any {
  const {scope, replacements} = options;

  const normalizedTranslations = Array.isArray(translations)
    ? translations
    : [translations];

  const normalizedId = normalizeIdentifier(id, scope);

  for (const translationDictionary of normalizedTranslations) {
    const result = translateWithDictionary(
      normalizedId,
      translationDictionary,
      locale,
      replacements,
    );

    if (result !== MISSING_TRANSLATION) {
      return result;
    }
  }

  throw new MissingTranslationError();
}

function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: PrimitiveReplacementDictionary,
): string | typeof MISSING_TRANSLATION;
function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: ComplexReplacementDictionary,
): React.ReactElement<any> | typeof MISSING_TRANSLATION;
function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: PrimitiveReplacementDictionary | ComplexReplacementDictionary,
): any {
  let result: string | TranslationDictionary = translations;

  for (const part of id.split(SEPARATOR)) {
    if (result == null || typeof result !== 'object') {
      return MISSING_TRANSLATION;
    }

    result = result[part];
  }

  if (
    typeof result === 'object' &&
    replacements != null &&
    replacements.hasOwnProperty(PLURALIZATION_KEY_NAME)
  ) {
    const count = replacements[PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      const group = new Intl.PluralRules(locale).select(count);
      result = result[group];
    }
  }

  if (typeof result === 'string') {
    return updateStringWithReplacements(result, replacements);
  } else {
    return MISSING_TRANSLATION;
  }
}

function updateStringWithReplacements(
  str: string,
  replacements?: ComplexReplacementDictionary,
): React.ReactElement<any>;
function updateStringWithReplacements(
  str: string,
  replacements?: PrimitiveReplacementDictionary,
): string;
function updateStringWithReplacements(
  str: string,
  replacements:
    | ComplexReplacementDictionary
    | PrimitiveReplacementDictionary = {},
): any {
  const replaceFinder = /([^{]*)({([^}]*)})?/g;
  const allReplacementsArePrimitives = Object.keys(replacements).every(
    key => typeof replacements[key] !== 'object',
  );

  if (allReplacementsArePrimitives) {
    return str.replace(REPLACE_REGEX, match => {
      const replacement = match.substring(1, match.length - 1);

      if (!replacements.hasOwnProperty(replacement)) {
        throw new MissingReplacementError(
          `No replacement found for key '${replacement}'. The following replacements were passed: ${Object.keys(
            replacements,
          )
            .map(key => `'${key}'`)
            .join(', ')}`,
        );
      }

      return replacements[replacement] as string;
    });
  } else {
    const pieces: (string | React.ReactElement<any>)[] = [];

    let match = replaceFinder.exec(str);
    let matchIndex = 0;

    while (match) {
      const regularText = match[1];
      const replacement = match[3];

      if (match.index >= str.length) {
        break;
      }

      if (regularText) {
        pieces.push(regularText);
      }

      if (replacement) {
        if (!replacements.hasOwnProperty(replacement)) {
          throw new Error(
            `No replacement found for key '${replacement}'. The following replacements were passed: ${Object.keys(
              replacements,
            )
              .map(key => `'${key}'`)
              .join(', ')}`,
          );
        }

        matchIndex += 1;
        const finalReplacement = React.isValidElement(replacements[replacement])
          ? React.cloneElement(
              replacements[replacement] as React.ReactElement<any>,
              {key: matchIndex},
            )
          : (replacements[replacement] as string);

        pieces.push(finalReplacement);
      }

      match = replaceFinder.exec(str);
    }

    replaceFinder.lastIndex = 0;

    return pieces;
  }
}

function normalizeIdentifier(id: string, scope?: string | string[]) {
  if (scope == null) {
    return id;
  }

  return `${
    typeof scope === 'string' ? scope : scope.join(SEPARATOR)
  }${SEPARATOR}${id}`;
}

export function noop() {}
