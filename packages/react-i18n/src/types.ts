export enum LanguageDirection {
  Rtl,
  Ltr,
}

export interface I18nDetails {
  locale: string;
  country?: string;
  currency?: string;
  timezone?: string;
  pseudolocalize?: boolean;
  fallbackLocale?: string;
}

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface PrimitiveReplacementDictionary {
  [key: string]: string | number;
}

export interface ComplexReplacementDictionary {
  [key: string]: string | number | React.ReactNode;
}

export type MaybePromise<T> = T | Promise<T>;

export {CurrencyCode} from './currencyCode';
