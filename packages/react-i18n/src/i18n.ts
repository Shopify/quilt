import {languageFromLocale, regionFromLocale} from '@shopify/i18n';
import {
  I18nDetails,
  PrimitiveReplacementDictionary,
  ComplexReplacementDictionary,
  TranslationDictionary,
  LanguageDirection,
} from './types';
import {MissingCurrencyCodeError, MissingTimezoneError} from './errors';
import {translate, TranslateOptions as RootTranslateOptions} from './utilities';

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  as?: 'number' | 'currency' | 'percent';
  precision?: number;
}

export interface TranslateOptions {
  scope: RootTranslateOptions<any>['scope'];
}

/* eslint-disable line-comment-position */
// See https://en.wikipedia.org/wiki/Right-to-left
const RTL_LANGUAGES = [
  'ae', // Avestan
  'ar', // 'العربية', Arabic
  'arc', // Aramaic
  'bcc', // 'بلوچی مکرانی', Southern Balochi
  'bqi', // 'بختياري', Bakthiari
  'ckb', // 'Soranî / کوردی', Sorani
  'dv', // Dhivehi
  'fa', // 'فارسی', Persian
  'glk', // 'گیلکی', Gilaki
  'he', // 'עברית', Hebrew
  'ku', // 'Kurdî / كوردی', Kurdish
  'mzn', // 'مازِرونی', Mazanderani
  'nqo', // N'Ko
  'pnb', // 'پنجابی', Western Punjabi
  'ps', // 'پښتو', Pashto,
  'sd', // 'سنڌي', Sindhi
  'ug', // 'Uyghurche / ئۇيغۇرچە', Uyghur
  'ur', // 'اردو', Urdu
  'yi', // 'ייִדיש', Yiddish
];
/* eslint-enable */

export default class I18n {
  readonly locale: string;
  readonly pseudolocalize: boolean | string;
  readonly defaultCurrency?: string;
  readonly defaultTimezone?: string;

  get language() {
    return languageFromLocale(this.locale);
  }

  get region() {
    return regionFromLocale(this.locale);
  }

  /**
   * @deprecated Use I18n#region instead.
   */
  get countryCode() {
    return regionFromLocale(this.locale);
  }

  get languageDirection() {
    return RTL_LANGUAGES.includes(this.language)
      ? LanguageDirection.Rtl
      : LanguageDirection.Ltr;
  }

  get isRtlLanguage() {
    return this.languageDirection === LanguageDirection.Rtl;
  }

  get isLtrLanguage() {
    return this.languageDirection === LanguageDirection.Ltr;
  }

  constructor(
    public translations: TranslationDictionary[],
    {locale, currency, timezone, pseudolocalize = false}: I18nDetails,
  ) {
    this.locale = locale;
    this.defaultCurrency = currency;
    this.defaultTimezone = timezone;
    this.pseudolocalize = pseudolocalize;
  }

  translate(
    id: string,
    options: TranslateOptions,
    replacements?: PrimitiveReplacementDictionary,
  ): string;
  translate(
    id: string,
    options: TranslateOptions,
    replacements?: ComplexReplacementDictionary,
  ): React.ReactElement<any>;
  translate(id: string, replacements?: PrimitiveReplacementDictionary): string;
  translate(
    id: string,
    replacements?: ComplexReplacementDictionary,
  ): React.ReactElement<any>;
  translate(
    id: string,
    optionsOrReplacements?:
      | TranslateOptions
      | PrimitiveReplacementDictionary
      | ComplexReplacementDictionary,
    replacements?:
      | PrimitiveReplacementDictionary
      | ComplexReplacementDictionary,
  ): any {
    const {pseudolocalize} = this;
    let normalizedOptions: RootTranslateOptions<
      PrimitiveReplacementDictionary | ComplexReplacementDictionary
    >;

    if (optionsOrReplacements == null) {
      normalizedOptions = {pseudotranslate: pseudolocalize};
    } else if (isTranslateOptions(optionsOrReplacements)) {
      normalizedOptions = {
        ...optionsOrReplacements,
        replacements,
        pseudotranslate: pseudolocalize,
      };
    } else {
      normalizedOptions = {
        replacements: optionsOrReplacements,
        pseudotranslate: pseudolocalize,
      };
    }

    return translate(id, normalizedOptions, this.translations, this.locale);
  }

  formatNumber(
    amount: number,
    {as, precision, ...options}: NumberFormatOptions = {},
  ) {
    const {locale, defaultCurrency: currency} = this;

    if (as === 'currency' && currency == null && options.currency == null) {
      throw new MissingCurrencyCodeError(
        `No currency code provided. formatNumber(amount, {as: 'currency'}) cannot be called without a currency code.`,
      );
    }

    return new Intl.NumberFormat(locale, {
      style: as,
      maximumFractionDigits: precision,
      currency,
      ...options,
    }).format(amount);
  }

  formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    const {locale, defaultTimezone: timezone} = this;

    if (timezone == null && (options == null || options.timeZone == null)) {
      throw new MissingTimezoneError(
        `No timezone code provided. formatDate() cannot be called without a timezone.`,
      );
    }

    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      ...options,
    }).format(date);
  }
}

function isTranslateOptions(
  object:
    | TranslateOptions
    | PrimitiveReplacementDictionary
    | ComplexReplacementDictionary,
): object is TranslateOptions {
  return 'scope' in object;
}
