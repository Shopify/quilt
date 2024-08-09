import {languageFromLocale, regionFromLocale} from './locale';
import {
  ReplacementDictionary,
  TranslationDictionary,
} from './simpleI18nUtils/types';
import {memoizedNumberFormatter, memoizedPluralRules} from './simpleI18nUtils';

const CARDINAL_PLURALIZATION_KEY_NAME = 'count';
const ORDINAL_PLURALIZATION_KEY_NAME = 'ordinal';
const MISSING_TRANSLATION = Symbol('Missing translation');
const SEPARATOR = '.';
const isString = (value: any): value is string => typeof value === 'string';

/**
 * Used to interpolate a string with values from an object.
 * `{key}` will be replaced with `replacements[key]`.
 */
export const INTERPOLATE_FORMAT = /{\s*(\w+)\s*}/g;

export class SimpleI18n {
  readonly locale: string;

  get language() {
    return languageFromLocale(this.locale);
  }

  get region() {
    return regionFromLocale(this.locale);
  }

  constructor(
    public readonly translations: TranslationDictionary[],
    locale: string,
  ) {
    this.locale = locale;
  }

  translate(id: string, replacements: ReplacementDictionary = {}): string {
    for (const translationDictionary of this.translations) {
      const result = this.translateWithDictionary(
        id,
        translationDictionary,
        this.locale,
        replacements,
      );

      if (result !== MISSING_TRANSLATION) {
        return result;
      }
    }

    throw new Error(
      `Missing translation for key: ${id} in locale: ${this.locale}`,
    );
  }

  translationKeyExists(id: string): boolean {
    let result: string | TranslationDictionary;

    for (const translationDictionary of this.translations) {
      result = translationDictionary;

      for (const part of id.split(SEPARATOR)) {
        result = result[part];
        if (!result) break;
      }

      if (result) {
        return true;
      }
    }

    return false;
  }

  private translateWithDictionary(
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
          result.ordinal[group] ||
          result.ordinal['other' as Intl.LDMLPluralRule];

        additionalReplacements[ORDINAL_PLURALIZATION_KEY_NAME] =
          memoizedNumberFormatter(locale).format(count);
      }
    }
    if (!isString(result)) {
      return MISSING_TRANSLATION;
    }

    return this.updateStringWithReplacements(result, {
      ...replacements,
      ...additionalReplacements,
    });
  }

  private updateStringWithReplacements(
    str: string,
    replacements: ReplacementDictionary = {},
  ): string {
    const replaceFinder = new RegExp(INTERPOLATE_FORMAT, 'g');

    return str.replace(replaceFinder, (match) => {
      const replacement = match.substring(1, match.length - 1).trim();

      if (!Object.prototype.hasOwnProperty.call(replacements, replacement)) {
        throw new Error(
          this.replacementErrorMessage(replacements, replacement),
        );
      }

      return replacements[replacement] as string;
    });
  }

  private replacementErrorMessage(
    replacements: ReplacementDictionary,
    replacement: string,
  ): string {
    let errorMessage = '';
    const replacementKeys = Object.keys(replacements);

    if (replacementKeys.length < 1) {
      errorMessage = `No replacement found for key '${replacement}' (and no replacements were passed in).`;
    } else {
      errorMessage = `No replacement found for key '${replacement}'. The following replacements were passed: ${replacementKeys
        .map((key) => `'${key}'`)
        .join(', ')}`;
    }
    return errorMessage;
  }
}
