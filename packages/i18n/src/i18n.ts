import {languageFromLocale, regionFromLocale} from './locale';
import {
  ReplacementDictionary,
  TranslationDictionary,
} from './simpleTranslate/types';
import {translate} from './simpleTranslate';

export class I18n {
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
}
