import React from 'react';
import {memoize as memoizeFn} from '@shopify/function-enhancers';
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

import {DEFAULT_INTERPOLATION} from './interpolate';

const MISSING_TRANSLATION = Symbol('Missing translation');
const PLURALIZATION_KEY_NAME = 'count';
const SEPARATOR = '.';

const isString = (value: any): value is string => typeof value === 'string';

const numberFormats = new Map<string, Intl.NumberFormat>();
export function memoizedNumberFormatter(
  locales?: string | string[],
  options?: Intl.NumberFormatOptions,
) {
  const key = numberFormatCacheKey(locales, options);
  if (numberFormats.has(key)) {
    return numberFormats.get(key)!;
  }
  const i = new Intl.NumberFormat(locales, options);
  numberFormats.set(key, i);
  return i;
}

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
  interpolate?: RegExp;
}

export function numberFormatCacheKey(
  locales?: string | string[],
  options: Intl.NumberFormatOptions = {},
) {
  const localeKey = Array.isArray(locales) ? locales.sort().join('-') : locales;

  return `${localeKey}-${JSON.stringify(options)}`;
}

function pluralRules(locale: string, options: Intl.PluralRulesOptions = {}) {
  return new Intl.PluralRules(locale, options);
}

export const memoizedPluralRules = memoizeFn(
  pluralRules,
  (locale: string, options: Intl.PluralRulesOptions = {}) =>
    `${locale}${JSON.stringify(options)}`,
);

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
      if (!result) break;
    }

    if (result) {
      if (replacements) {
        return isString(result)
          ? updateStringWithReplacements(result, replacements)
          : updateTreeWithReplacements(result, locale, replacements);
      }

      return result;
    }
  }

  throw new MissingTranslationError(id, locale);
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
  const {scope, replacements, pseudotranslate, interpolate} = options;

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
      {pseudotranslate, interpolate},
    );

    if (result !== MISSING_TRANSLATION) {
      return result;
    }
  }

  throw new MissingTranslationError(normalizedId, locale);
}

type TranslateWithDictionaryOptions = Pick<
  TranslateOptions,
  'pseudotranslate' | 'interpolate'
>;

function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: PrimitiveReplacementDictionary,
  options?: TranslateWithDictionaryOptions,
): string | typeof MISSING_TRANSLATION;
function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: ComplexReplacementDictionary,
  options?: TranslateWithDictionaryOptions,
): React.ReactElement<any> | typeof MISSING_TRANSLATION;
function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: PrimitiveReplacementDictionary | ComplexReplacementDictionary,
  {pseudotranslate = false, interpolate}: TranslateWithDictionaryOptions = {},
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
      const group = memoizedPluralRules(locale).select(count);
      result = result[group];

      additionalReplacements[PLURALIZATION_KEY_NAME] = memoizedNumberFormatter(
        locale,
      ).format(count);
    }
  }

  const processedString =
    isString(result) && pseudotranslate
      ? pseudotranslateString(result, {
          ...PSEUDOTRANSLATE_OPTIONS,
          toLocale:
            typeof pseudotranslate === 'boolean' ? undefined : pseudotranslate,
        })
      : result;

  if (!isString(processedString)) {
    return MISSING_TRANSLATION;
  }

  return updateStringWithReplacements(
    processedString,
    {
      ...replacements,
      ...additionalReplacements,
    },
    {interpolate},
  );
}

type UpdateStringWithReplacementsOptions = Pick<
  TranslateOptions,
  'interpolate'
>;

function updateStringWithReplacements(
  str: string,
  replacements?: ComplexReplacementDictionary,
  options?: UpdateStringWithReplacementsOptions,
): React.ReactElement<any>;
function updateStringWithReplacements(
  str: string,
  replacements?: PrimitiveReplacementDictionary,
  options?: UpdateStringWithReplacementsOptions,
): string;
function updateStringWithReplacements(
  str: string,
  replacements:
    | ComplexReplacementDictionary
    | PrimitiveReplacementDictionary = {},
  {interpolate}: UpdateStringWithReplacementsOptions = {},
): any {
  const pieces: (string | React.ReactElement<any>)[] = [];

  const replaceFinder = new RegExp(interpolate || DEFAULT_INTERPOLATION, 'g');

  let matchIndex = 0;
  let lastOffset = 0;

  // Uses replace callback, but not its return value
  str.replace(
    replaceFinder,
    (
      match,
      _fullPlaceholder: string,
      replacementKey: string,
      offset: number,
    ) => {
      if (!replacementKey) return '';

      if (!Object.prototype.hasOwnProperty.call(replacements, replacementKey)) {
        throw new MissingReplacementError(replacementKey, replacements);
      }

      matchIndex += 1;

      const replacementValue = replacements[replacementKey];
      const finalReplacement =
        replacementValue && React.isValidElement(replacementValue)
          ? React.cloneElement(replacementValue, {key: matchIndex})
          : (replacementValue as string);

      // Push the previous part if it exists
      const previousString = str.substring(lastOffset, offset);
      if (previousString) pieces.push(previousString);

      // Push the new part with the replacement
      pieces.push(finalReplacement);

      lastOffset = offset + match.length;

      // to satisfy the typechecker
      return '';
    },
  );

  // Push the last part of the source string
  pieces.push(str.substr(lastOffset));

  return pieces.every(isString) ? pieces.join('') : pieces;
}

function normalizeIdentifier(id: string, scope?: string | string[]) {
  if (scope == null) {
    return id;
  }

  return `${isString(scope) ? scope : scope.join(SEPARATOR)}${SEPARATOR}${id}`;
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
      const group = memoizedPluralRules(locale).select(count);
      if (isString(translationTree[group])) {
        return updateStringWithReplacements(translationTree[group] as string, {
          ...replacements,
          PLURALIZATION_KEY_NAME: memoizedNumberFormatter(locale).format(count),
        });
      }
    }
  }

  return Object.keys(translationTree).reduce(
    (acc, key) => ({
      ...acc,
      [key]: isString(translationTree[key])
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
