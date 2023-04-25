import {UnicodeCharacterSet} from '../constants';

const SUPPORTED_SCRIPTS = [
  UnicodeCharacterSet.Latin,
  UnicodeCharacterSet.Han,
  UnicodeCharacterSet.Hiragana,
  UnicodeCharacterSet.Katakana,
  UnicodeCharacterSet.Hangul,
  UnicodeCharacterSet.Thai,
] as const;

export function identifyScripts(text: string): UnicodeCharacterSet[] {
  return SUPPORTED_SCRIPTS.filter((supportedScript) =>
    new RegExp(`${supportedScript}`).test(text),
  );
}
