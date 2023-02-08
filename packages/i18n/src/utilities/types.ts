export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface ReplacementDictionary {
  [key: string]: string | number;
}

export enum LanguageDirection {
  Rtl,
  Ltr,
}

export {CurrencyCode} from './currencyCode';
