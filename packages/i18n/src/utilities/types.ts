export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface ReplacementDictionary {
  [key: string]: string | number;
}

export interface FormatterConfig {
  locale: string;
  country?: string;
  currency?: string;
  timezone?: string;
}

export enum LanguageDirection {
  Rtl,
  Ltr,
}

export {CurrencyCode} from './currencyCode';
