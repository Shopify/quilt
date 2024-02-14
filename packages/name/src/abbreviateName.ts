import {getGraphemes, identifyScripts} from './utilities';
import {formatName} from './formatName';
import {UnicodeCharacterSet} from './constants';

// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/name_formatter.rb.
export function abbreviateName({
  name,
  locale,
  options,
}: {
  name: {givenName?: string; familyName?: string};
  locale: string;
  options?: {idealMaxLength?: number};
}) {
  return (
    tryAbbreviateName({
      givenName: name.givenName,
      familyName: name.familyName,
      idealMaxLength: options?.idealMaxLength,
    }) ?? formatName({name, locale})
  );
}

export function tryAbbreviateName({
  givenName,
  familyName,
  idealMaxLength = 3,
}: {
  givenName?: string;
  familyName?: string;
  idealMaxLength?: number;
}): string | undefined {
  if (!givenName && !familyName) {
    return undefined;
  }

  const givenNameTrimmed = givenName?.trim();
  const familyNameTrimmed = familyName?.trim();

  const combinedName = [givenNameTrimmed, familyNameTrimmed].join('');
  if (new RegExp(`${UnicodeCharacterSet.Punctuation}|\\s`).test(combinedName)) {
    return undefined;
  }

  const scripts = identifyScripts(combinedName);
  if (scripts.length !== 1) {
    return undefined;
  }
  const script = scripts[0];

  switch (script) {
    case UnicodeCharacterSet.Latin:
      return [givenNameTrimmed?.[0], familyNameTrimmed?.[0]].join('');
    case UnicodeCharacterSet.Han:
    case UnicodeCharacterSet.Katakana:
    case UnicodeCharacterSet.Hiragana:
      return familyNameTrimmed;
    case UnicodeCharacterSet.Hangul:
      if (givenNameTrimmed) {
        if (givenNameTrimmed.length > idealMaxLength) {
          return getGraphemes({text: givenNameTrimmed, locale: 'ko'})?.[0];
        } else {
          return givenNameTrimmed;
        }
      } else {
        return familyNameTrimmed;
      }
    case UnicodeCharacterSet.Thai:
      if (givenNameTrimmed) {
        return getGraphemes({text: givenNameTrimmed, locale: 'th'})?.[0];
      } else {
        return getGraphemes({text: familyNameTrimmed, locale: 'th'})?.[0];
      }
    default:
      return undefined;
  }
}
