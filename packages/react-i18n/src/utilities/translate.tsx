import React from 'react';
import {memoize as memoizeFn} from '@shopify/function-enhancers';
import type {PseudotranslateOptions} from '@shopify/i18n';
import {pseudotranslate as pseudotranslateString} from '@shopify/i18n';

import type {
  TranslationDictionary,
  ComplexReplacementDictionary,
  PrimitiveReplacementDictionary,
} from '../types';
import {MissingTranslationError, MissingReplacementError} from '../errors';

import {DEFAULT_FORMAT} from './interpolate';

const MISSING_TRANSLATION = Symbol('Missing translation');
const CARDINAL_PLURALIZATION_KEY_NAME = 'count';
const ORDINAL_PLURALIZATION_KEY_NAME = 'ordinal';
const SEPARATOR = '.';
const UNICODE_NUMBERING_SYSTEM = '-u-nu-';
const LATIN = 'latn';

const isString = (value: any): value is string => typeof value === 'string';

const numberFormats = new Map<string, Intl.NumberFormat>();
export function memoizedNumberFormatter(
  locales?: string | string[],
  options?: Intl.NumberFormatOptions,
) {
  // force a latin locale for number formatting
  const latnLocales = latinLocales(locales);
  const key = numberFormatCacheKey(latnLocales, options);
  if (numberFormats.has(key)) {
    return numberFormats.get(key)!;
  }
  const i = new Intl.NumberFormat(latnLocales, options);
  numberFormats.set(key, i);
  return i;
}

function latinLocales(locales?: string | string[]) {
  return Array.isArray(locales)
    ? locales.map((locale) => latinLocale(locale)!)
    : latinLocale(locales);
}

function latinLocale(locale?: string) {
  if (!locale) return locale;
  // Intl.Locale was added to iOS in v14. See https://caniuse.com/?search=Intl.Locale
  // We still support ios 12/13, so we need to check if this works and fallback to the default behaviour if not
  try {
    return new Intl.Locale(locale, {
      numberingSystem: LATIN,
    }).toString();
  } catch {
    const numberingSystemRegex = new RegExp(
      `(?:-x|${UNICODE_NUMBERING_SYSTEM}).*`,
      'g',
    );
    const latinNumberingSystem = `${UNICODE_NUMBERING_SYSTEM}${LATIN}`;
    return locale
      .replace(numberingSystemRegex, '')
      .concat(latinNumberingSystem);
  }
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
    Object.prototype.hasOwnProperty.call(
      replacements,
      CARDINAL_PLURALIZATION_KEY_NAME,
    )
  ) {
    const count = replacements[CARDINAL_PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      // Explicit 0 and 1 rules take precedence over the pluralization rules
      // https://unicode-org.github.io/cldr/ldml/tr35-numbers.html#Explicit_0_1_rules
      if (count === 0 && result['0'] !== undefined) {
        result = result['0'];
      } else if (count === 1 && result['1'] !== undefined) {
        result = result['1'];
      } else {
        const group = memoizedPluralRules(locale).select(count);
        result = result[group] || result.other;
      }
      additionalReplacements[CARDINAL_PLURALIZATION_KEY_NAME] =
        memoizedNumberFormatter(locale).format(count);
    }
  } else if (
    typeof result === 'object' &&
    replacements != null &&
    Object.prototype.hasOwnProperty.call(
      replacements,
      ORDINAL_PLURALIZATION_KEY_NAME,
    )
  ) {
    const count = replacements[ORDINAL_PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      const group = memoizedPluralRules(locale, {type: 'ordinal'}).select(
        count,
      );
      result =
        result.ordinal[group] || result.ordinal['other' as Intl.LDMLPluralRule];

      additionalReplacements[ORDINAL_PLURALIZATION_KEY_NAME] =
        memoizedNumberFormatter(locale).format(count);
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
  const pieces: (string | React.ReactNode)[] = [];

  const replaceFinder = new RegExp(interpolate || DEFAULT_FORMAT, 'g');

  let matchIndex = 0;
  let lastOffset = 0;

  // Uses replace callback, but not its return value
  str.replace(
    replaceFinder,
    (match, replacementKey: string, offset: number) => {
      if (!replacementKey) {
        throw new Error(
          'Invalid replacement key. The interpolatation format RegExp is possibly too permissive.',
        );
      }

      if (!Object.prototype.hasOwnProperty.call(replacements, replacementKey)) {
        throw new MissingReplacementError(replacementKey, replacements);
      }

      matchIndex += 1;

      // Push the previous part if it exists
      const previousString = str.substring(lastOffset, offset);
      if (previousString) pieces.push(previousString);

      lastOffset = offset + match.length;

      // Push the new part with the replacement
      const replacementValue = replacements[replacementKey];

      if (React.isValidElement(replacementValue)) {
        pieces.push(React.cloneElement(replacementValue, {key: matchIndex}));
      } else if (typeof replacementValue === 'object') {
        pieces.push(replacementValue);
      } else {
        pieces.push(String(replacementValue));
      }

      // to satisfy the typechecker
      return '';
    },
  );

  // Push the last part of the source string
  const lastPart = str.substring(lastOffset);
  if (lastPart) pieces.push(lastPart);

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
    Object.prototype.hasOwnProperty.call(
      replacements,
      CARDINAL_PLURALIZATION_KEY_NAME,
    )
  ) {
    const count = replacements[CARDINAL_PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      const group = memoizedPluralRules(locale).select(count);
      if (isString(translationTree[group])) {
        return updateStringWithReplacements(translationTree[group] as string, {
          ...replacements,
          CARDINAL_PLURALIZATION_KEY_NAME:
            memoizedNumberFormatter(locale).format(count),
        });
      }
    }
  } else if (
    Object.prototype.hasOwnProperty.call(
      replacements,
      ORDINAL_PLURALIZATION_KEY_NAME,
    )
  ) {
    const count = replacements[ORDINAL_PLURALIZATION_KEY_NAME];

    if (typeof count === 'number') {
      const group = memoizedPluralRules(locale, {type: 'ordinal'}).select(
        count,
      );
      if (isString(translationTree[group])) {
        return updateStringWithReplacements(translationTree[group] as string, {
          ...replacements,
          ORDINAL_PLURALIZATION_KEY_NAME:
            memoizedNumberFormatter(locale).format(count),
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
