import React from 'react';
import {
  pseudotranslate as pseudotranslateString,
  PseudotranslateOptions,
} from '@shopify/i18n';
import {
  TranslationDictionary,
  ComplexReplacementDictionary,
  PrimitiveReplacementDictionary,
} from '../types';
import {MissingTranslationError, MissingReplacementError} from '../errors';

const REPLACE_REGEX = /{([^}]*)}/g;
const MISSING_TRANSLATION = Symbol('Missing translation');
const PLURALIZATION_KEY_NAME = 'count';
const SEPARATOR = '.';

export const PSEUDOTRANSLATE_OPTIONS: PseudotranslateOptions = {
  startDelimiter: '{',
  endDelimiter: '}',
  prepend: '[!!',
  append: '!!]',
};

export interface TranslateOptions<Replacements = {}> {
  scope?: string | string[];
  replacements?: Replacements;
  pseudotranslate?: boolean | string;
}

export function getTranslationTree(
  id: string,
  translations: TranslationDictionary | TranslationDictionary[],
  locale: string,
  replacements?: PrimitiveReplacementDictionary | ComplexReplacementDictionary,
): string | TranslationDictionary {
  const normalizedTranslations = Array.isArray(translations)
    ? translations
    : [translations];

  let result: string | TranslationDictionary;

  for (const translationDictionary of normalizedTranslations) {
    result = translationDictionary;

    for (const part of id.split(SEPARATOR)) {
      result = result[part];
    }

    if (result) {
      if (replacements) {
        return typeof result === 'string'
          ? updateStringWithReplacements(result, replacements)
          : updateTreeWithReplacements(result, locale, replacements);
      }

      return result;
    }
  }

  throw new MissingTranslationError(id);
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
  const {scope, replacements, pseudotranslate} = options;

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
      {pseudotranslate},
    );

    if (result !== MISSING_TRANSLATION) {
      return result;
    }
  }

  throw new MissingTranslationError(id);
}

function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: PrimitiveReplacementDictionary,
  options?: Pick<TranslateOptions, 'pseudotranslate'>,
): string | typeof MISSING_TRANSLATION;
function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: ComplexReplacementDictionary,
  options?: Pick<TranslateOptions, 'pseudotranslate'>,
): React.ReactElement<any> | typeof MISSING_TRANSLATION;
function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: PrimitiveReplacementDictionary | ComplexReplacementDictionary,
  {pseudotranslate = false}: Pick<TranslateOptions, 'pseudotranslate'> = {},
): any {
  let result: string | TranslationDictionary = translations;

  for (const part of id.split(SEPARATOR)) {
    if (result == null || typeof result !== 'object') {
      return MISSING_TRANSLATION;
    }

    result = result[part];
  }

  const additionalReplacements = {};

  if (
    typeof result === 'object' &&
    replacements != null &&
    Object.prototype.hasOwnProperty.call(replacements, PLURALIZATION_KEY_NAME)
  ) {
    const count = replacements[PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      const group = new Intl.PluralRules(locale).select(count);
      result = result[group];

      additionalReplacements[PLURALIZATION_KEY_NAME] = new Intl.NumberFormat(
        locale,
      ).format(count);
    }
  }

  const processedString =
    typeof result === 'string' && pseudotranslate
      ? pseudotranslateString(result, {
          ...PSEUDOTRANSLATE_OPTIONS,
          toLocale:
            typeof pseudotranslate === 'boolean' ? undefined : pseudotranslate,
        })
      : result;

  if (typeof processedString === 'string') {
    return updateStringWithReplacements(processedString, {
      ...replacements,
      ...additionalReplacements,
    });
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

      if (!Object.prototype.hasOwnProperty.call(replacements, replacement)) {
        throw new MissingReplacementError(replacement, replacements);
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
        if (!Object.prototype.hasOwnProperty.call(replacements, replacement)) {
          throw new MissingReplacementError(replacement, replacements);
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

function updateTreeWithReplacements(
  translationTree: TranslationDictionary,
  locale: string,
  replacements: PrimitiveReplacementDictionary | ComplexReplacementDictionary,
) {
  if (
    Object.prototype.hasOwnProperty.call(replacements, PLURALIZATION_KEY_NAME)
  ) {
    const count = replacements[PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      const group = new Intl.PluralRules(locale).select(count);
      if (typeof translationTree[group] === 'string') {
        return updateStringWithReplacements(translationTree[group] as string, {
          ...replacements,
          PLURALIZATION_KEY_NAME: new Intl.NumberFormat(locale).format(count),
        });
      }
    }
  }

  return Object.keys(translationTree).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        typeof translationTree[key] === 'string'
          ? updateStringWithReplacements(
              translationTree[key] as string,
              replacements,
            )
          : updateTreeWithReplacements(
              translationTree[key] as TranslationDictionary,
              locale,
              replacements,
            ),
    }),
    {},
  );
}
