import {languageFromLocale, regionFromLocale} from './locale';
import {
  I18nDetails,
  PrimitiveReplacementDictionary,
  TranslationDictionary,
} from './types';
import {I18nError} from './errors';
import {translate} from './utilities';

export class I18n {
  readonly locale: string;
  readonly defaultCountry?: string;
  readonly defaultCurrency?: string;
  readonly defaultTimezone?: string;
  readonly defaultInterpolate?: RegExp;
  readonly onError: NonNullable<I18nDetails['onError']>;
  readonly loading: boolean;

  get language() {
    return languageFromLocale(this.locale);
  }

  get region() {
    return regionFromLocale(this.locale);
  }

  constructor(
    public readonly translations: TranslationDictionary[],
    {
      locale,
      currency,
      timezone,
      country,
      onError,
      loading,
      interpolate,
    }: I18nDetails & {loading?: boolean},
  ) {
    this.locale = locale;
    this.defaultCountry = country;
    this.defaultCurrency = currency;
    this.defaultTimezone = timezone;
    this.defaultInterpolate = interpolate;
    this.onError = onError || this.defaultOnError;
    this.loading = loading || false;
  }

  translate(
    id: string,
    replacements: PrimitiveReplacementDictionary = {},
  ): string {
    try {
      return translate(id, replacements, this.translations, this.locale);
    } catch (error) {
      this.onError(error as I18nError);
      return '';
    }
  }

  private defaultOnError(error: I18nError) {
    throw error;
  }
}
