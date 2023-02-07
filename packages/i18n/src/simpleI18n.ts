import {languageFromLocale, regionFromLocale} from './locale';
import {
  ReplacementDictionary,
  TranslationDictionary,
} from './simpleI18nUtils/types';
import {translate, translationKeyExists} from './simpleI18nUtils';

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
    return translate(id, replacements, this.translations, this.locale);
  }

  translationKeyExists(id: string): boolean {
    return translationKeyExists(id, this.translations);
  }
}
