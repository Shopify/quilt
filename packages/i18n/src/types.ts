import {I18nError} from './errors';

export interface I18nDetails {
  locale: string;
  country?: string;
  currency?: string;
  timezone?: string;
  pseudolocalize?: boolean;
  fallbackLocale?: string;
  onError?(error: I18nError): void;
  interpolate?: RegExp;
}

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface PrimitiveReplacementDictionary {
  [key: string]: string | number;
}
