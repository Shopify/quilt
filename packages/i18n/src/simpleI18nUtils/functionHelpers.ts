import {memoize as memoizeFn} from '@shopify/function-enhancers';

const UNICODE_NUMBERING_SYSTEM = '-u-nu-';
const LATIN = 'latn';

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
