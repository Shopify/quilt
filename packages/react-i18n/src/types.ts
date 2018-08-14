export enum LanguageDirection {
  Rtl,
  Ltr,
}

export interface I18nDetails {
  locale: string;
  currency?: string;
  timezone?: string;
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
