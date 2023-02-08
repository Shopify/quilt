import {memoizedPluralRules} from './utilities/translate';
import {languageFromLocale, regionFromLocale} from './locale';
import {ReplacementDictionary, TranslationDictionary} from './utilities/types';
import {translate, translationKeyExists} from './utilities';

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
    return translate(id, this.translations, this.locale, replacements);
  }

  translationKeyExists(id: string): boolean {
    return translationKeyExists(id, this.translations);
  }

  ordinal(amount: number) {
    const {locale} = this;
    const group = memoizedPluralRules(locale, {type: 'ordinal'}).select(amount);
    return this.translate(`ordinal${group}`, {amount});
  }
}
