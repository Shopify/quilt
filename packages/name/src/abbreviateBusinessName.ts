import {getGraphemes, identifyScripts} from './utilities';
import {UnicodeCharacterSet} from './constants';

// Note: A similar Ruby implementation of this function also exists at https://github.com/Shopify/shopify-i18n/blob/main/lib/shopify-i18n/business_name_formatter.rb.
export function abbreviateBusinessName({
  name,
  idealMaxLength,
}: {
  name: string;
  idealMaxLength?: number;
}) {
  return tryAbbreviateBusinessName({name, idealMaxLength}) ?? name;
}

export function tryAbbreviateBusinessName({
  name,
  idealMaxLength = 3,
}: {
  name: string;
  idealMaxLength?: number;
}): string | undefined {
  const nameTrimmed = name.trim();

  const scripts = identifyScripts(nameTrimmed);
  if (scripts.length !== 1) {
    return undefined;
  }
  const script = scripts[0];
  const words = nameTrimmed.split(' ');

  switch (script) {
    case UnicodeCharacterSet.Latin:
      if (words.length === 1) {
        return words[0].slice(0, idealMaxLength);
      } else if (words.length <= idealMaxLength) {
        return words.map((word) => word[0]).join('');
      } else {
        return words.slice(0)[0][0] + words.slice(-1)[0][0];
      }
    case UnicodeCharacterSet.Han:
    case UnicodeCharacterSet.Katakana:
    case UnicodeCharacterSet.Hiragana: {
      if (nameTrimmed.includes(' ')) {
        return undefined;
      } else {
        return nameTrimmed;
      }
    }
    case UnicodeCharacterSet.Hangul: {
      const firstWord = nameTrimmed.split(' ')[0];
      return getGraphemes({text: firstWord, locale: 'ko'})
        ?.slice(0, idealMaxLength)
        .join('');
    }
    case UnicodeCharacterSet.Thai: {
      // Thai language does not use spaces between words
      if (nameTrimmed.includes(' ')) {
        return undefined;
      } else {
        return getGraphemes({text: nameTrimmed, locale: 'th'})?.[0];
      }
    }
    default:
      return undefined;
  }
}
