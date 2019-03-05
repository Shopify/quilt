export class MissingTranslationError extends Error {}
export class MissingReplacementError extends Error {}
export class MissingCurrencyCodeError extends Error {}
export class MissingCountryError extends Error {}
export class InvalidI18nConnectionError extends Error {}

export type I18nError =
  | MissingTranslationError
  | MissingReplacementError
  | MissingCurrencyCodeError
  | MissingCountryError
  | InvalidI18nConnectionError;
