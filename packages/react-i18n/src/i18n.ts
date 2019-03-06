import {languageFromLocale, regionFromLocale} from '@shopify/i18n';
import {memoize} from '@shopify/javascript-utilities/decorators';
import {
  I18nDetails,
  PrimitiveReplacementDictionary,
  ComplexReplacementDictionary,
  TranslationDictionary,
  LanguageDirection,
} from './types';
import {
  dateStyle,
  DateStyle,
  DEFAULT_WEEK_START_DAY,
  WEEK_START_DAYS,
  RTL_LANGUAGES,
  Weekdays,
  currencyDecimalPlaces,
  DEFAULT_DECIMAL_PLACES,
} from './constants';
import {
  MissingCurrencyCodeError,
  MissingCountryError,
  I18nError,
} from './errors';
import {
  getCurrencySymbol,
  translate,
  TranslateOptions as RootTranslateOptions,
} from './utilities';

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  as?: 'number' | 'currency' | 'percent';
  precision?: number;
}

export interface TranslateOptions {
  scope: RootTranslateOptions<any>['scope'];
}

// Used for currecies that don't use fractional units (eg. JPY)
const DECIMAL_NOT_SUPPORTED = 'N/A';
const DECIMAL_VALUE_FOR_CURRENCIES_WITHOUT_DECIMALS = '00';

export default class I18n {
  readonly locale: string;
  readonly pseudolocalize: boolean | string;
  readonly defaultCountry?: string;
  readonly defaultCurrency?: string;
  readonly defaultTimezone?: string;
  readonly onError: NonNullable<I18nDetails['onError']>;

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
    {
      locale,
      currency,
      timezone,
      country,
      pseudolocalize = false,
      onError,
    }: I18nDetails,
  ) {
    this.locale = locale;
    this.defaultCountry = country;
    this.defaultCurrency = currency;
    this.defaultTimezone = timezone;
    this.pseudolocalize = pseudolocalize;
    this.onError = onError || defaultOnError;
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

    try {
      return translate(id, normalizedOptions, this.translations, this.locale);
    } catch (error) {
      this.onError(error);
      return '';
    }
  }

  formatNumber(
    amount: number,
    {as, precision, ...options}: NumberFormatOptions = {},
  ) {
    const {locale, defaultCurrency: currency} = this;

    if (as === 'currency' && currency == null && options.currency == null) {
      this.onError(
        new MissingCurrencyCodeError(
          `No currency code provided. formatNumber(amount, {as: 'currency'}) cannot be called without a currency code.`,
        ),
      );

      return '';
    }

    return new Intl.NumberFormat(locale, {
      style: as,
      maximumFractionDigits: precision,
      currency,
      ...options,
    }).format(amount);
  }

  formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}) {
    return this.formatNumber(amount, {as: 'currency', ...options});
  }

  unformatCurrency(input: string, currencyCode: string): string {
    const nonDigits = /\D/g;

    // This decimal symbol will always be '.' regardless of the locale
    // since it's our internal representation of the string
    const symbol = this.decimalSymbol(currencyCode);
    const decimal = symbol === DECIMAL_NOT_SUPPORTED ? '.' : symbol;

    const lastDecimalIndex = input.lastIndexOf(decimal);
    const integerValue = input
      .substring(0, lastDecimalIndex)
      .replace(nonDigits, '');
    const decimalValue = input
      .substring(lastDecimalIndex + 1)
      .replace(nonDigits, '');

    const normalizedDecimal = lastDecimalIndex === -1 ? '' : '.';
    const normalizedValue = `${integerValue}${normalizedDecimal}${decimalValue}`;
    const invalidValue = normalizedValue === '' || normalizedValue === '.';

    if (symbol === DECIMAL_NOT_SUPPORTED) {
      const roundedAmount = parseFloat(normalizedValue).toFixed(0);
      return `${roundedAmount}.${DECIMAL_VALUE_FOR_CURRENCIES_WITHOUT_DECIMALS}`;
    }

    const decimalPlaces =
      currencyDecimalPlaces.get(currencyCode.toUpperCase()) ||
      DEFAULT_DECIMAL_PLACES;
    return invalidValue
      ? ''
      : parseFloat(normalizedValue).toFixed(decimalPlaces);
  }

  formatPercentage(amount: number, options: Intl.NumberFormatOptions = {}) {
    return this.formatNumber(amount, {as: 'percent', ...options});
  }

  formatDate(
    date: Date,
    options: Intl.DateTimeFormatOptions & {style?: DateStyle} = {},
  ): string {
    const {locale, defaultTimezone} = this;
    const {timeZone = defaultTimezone} = options;

    // Etc/GMT+12 is not supported in most browsers and there is no equivalent fallback
    if (timeZone === 'Etc/GMT+12') {
      const adjustedDate = new Date(date.valueOf() - 12 * 60 * 60 * 1000);

      return this.formatDate(adjustedDate, {...options, timeZone: 'UTC'});
    }

    const {style = undefined, ...formatOptions} = options || {};

    if (style) {
      return style === DateStyle.Humanize
        ? this.humanizeDate(date, formatOptions)
        : this.formatDate(date, {...formatOptions, ...dateStyle[style]});
    }

    return new Intl.DateTimeFormat(locale, {
      timeZone,
      ...formatOptions,
    }).format(date);
  }

  weekStartDay(argCountry?: I18n['defaultCountry']): Weekdays {
    const country = argCountry || this.defaultCountry;

    if (!country) {
      throw new MissingCountryError(
        `No country code provided. weekStartDay() cannot be called without a country code.`,
      );
    }

    return WEEK_START_DAYS.get(country) || DEFAULT_WEEK_START_DAY;
  }

  getCurrencySymbol = (currencyCode?: string) => {
    const currency = currencyCode || this.defaultCurrency;
    if (currency == null) {
      this.onError(
        new MissingCurrencyCodeError(
          `No currency code provided. formatCurrency cannot be called without a currency code.`,
        ),
      );

      return '';
    }
    return this.getCurrencySymbolLocalized(this.locale, currency);
  };

  @memoize((currency: string, locale: string) => `${locale}${currency}`)
  getCurrencySymbolLocalized(locale: string, currency: string) {
    return getCurrencySymbol(locale, {currency});
  }

  private humanizeDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    const today = new Date();

    if (isSameDate(today, date)) {
      return this.translate('today');
    } else if (isYesterday(date)) {
      return this.translate('yesterday');
    } else {
      return this.formatDate(date, {
        ...options,
        ...dateStyle[DateStyle.Humanize],
      });
    }
  }

  private decimalSymbol(currencyCode: string) {
    const digitOrSpace = /\s|\d/g;
    const {symbol} = this.getCurrencySymbolLocalized(this.locale, currencyCode);

    const templatedInput = 1;
    const decimal = this.formatCurrency(templatedInput, {
      currency: currencyCode,
    })
      .replace(symbol, '')
      .replace(digitOrSpace, '');

    return decimal.length === 0 ? DECIMAL_NOT_SUPPORTED : decimal;
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

function isSameMonthAndYear(source: Date, target: Date) {
  return (
    source.getFullYear() === target.getFullYear() &&
    source.getMonth() === target.getMonth()
  );
}

function isSameDate(source: Date, target: Date) {
  return (
    isSameMonthAndYear(source, target) && source.getDate() === target.getDate()
  );
}

function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDate(yesterday, date);
}

function defaultOnError(error: I18nError) {
  throw error;
}
