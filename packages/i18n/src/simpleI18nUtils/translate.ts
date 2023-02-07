import {memoize as memoizeFn} from '@shopify/function-enhancers';

import {TranslationDictionary, ReplacementDictionary} from './types';
import {MissingTranslationError, MissingReplacementError} from './errors';

const MISSING_TRANSLATION = Symbol('Missing translation');
const CARDINAL_PLURALIZATION_KEY_NAME = 'count';
const ORDINAL_PLURALIZATION_KEY_NAME = 'ordinal';
const SEPARATOR = '.';
const UNICODE_NUMBERING_SYSTEM = '-u-nu-';
const LATIN = 'latn';

const isString = (value: any): value is string => typeof value === 'string';

const numberFormats = new Map<string, Intl.NumberFormat>();

/**
 * Used to interpolate a string with values from an object.
 * `{key}` will be replaced with `replacements[key]`.
 */
export const INTERPOLATE_FORMAT = /{\s*(\w+)\s*}/g;

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

export function translate(
  id: string,
  replacements: ReplacementDictionary,
  translations: TranslationDictionary | TranslationDictionary[],
  locale: string,
): string {
  const normalizedTranslations = Array.isArray(translations)
    ? translations
    : [translations];

  for (const translationDictionary of normalizedTranslations) {
    const result = translateWithDictionary(
      id,
      translationDictionary,
      locale,
      replacements,
    );

    if (result !== MISSING_TRANSLATION) {
      return result;
    }
  }

  throw new MissingTranslationError(id, locale);
}

function translateWithDictionary(
  id: string,
  translations: TranslationDictionary,
  locale: string,
  replacements?: ReplacementDictionary,
): string | typeof MISSING_TRANSLATION {
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

  if (!isString(result)) {
    return MISSING_TRANSLATION;
  }

  return updateStringWithReplacements(result, {
    ...replacements,
    ...additionalReplacements,
  });
}

function updateStringWithReplacements(
  str: string,
  replacements: ReplacementDictionary = {},
): string {
  const pieces: string[] = [];

  const replaceFinder = new RegExp(INTERPOLATE_FORMAT, 'g');

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

      // Push the previous part if it exists
      const previousString = str.substring(lastOffset, offset);
      if (previousString) pieces.push(previousString);

      lastOffset = offset + match.length;

      // Push the new part with the replacement
      const replacementValue = replacements[replacementKey];

      if (typeof replacementValue === 'object') {
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
