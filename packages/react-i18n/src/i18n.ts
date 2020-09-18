import {
  formatDate,
  isFutureDate,
  isLessThanOneHourAgo,
  isLessThanOneMinuteAgo,
  isLessThanOneWeekAgo,
  isLessThanOneYearAgo,
  isToday,
  isTomorrow,
  isYesterday,
  TimeUnit,
  isLessThanOneWeekAway,
  isLessThanOneYearAway,
} from '@shopify/dates';
import {memoize} from '@shopify/decorators';
import {languageFromLocale, regionFromLocale} from '@shopify/i18n';

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
  Weekday,
  currencyDecimalPlaces,
  DEFAULT_DECIMAL_PLACES,
  EASTERN_NAME_ORDER_FORMATTERS,
} from './constants';
import {
  MissingCurrencyCodeError,
  MissingCountryError,
  I18nError,
} from './errors';
import {
  getCurrencySymbol,
  translate,
  getTranslationTree,
  TranslateOptions as RootTranslateOptions,
  memoizedNumberFormatter,
  memoizedPluralRules,
} from './utilities';

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  as?: 'number' | 'currency' | 'percent';
  precision?: number;
}

export interface CurrencyFormatOptions extends NumberFormatOptions {
  form?: 'auto' | 'short' | 'explicit';
}

export interface TranslateOptions {
  scope: RootTranslateOptions<any>['scope'];
}

// Used for currecies that don't use fractional units (eg. JPY)
const DECIMAL_NOT_SUPPORTED = 'N/A';
const PERIOD = '.';
const DECIMAL_VALUE_FOR_CURRENCIES_WITHOUT_DECIMALS = '00';

export class I18n {
  readonly locale: string;
  readonly pseudolocalize: boolean | string;
  readonly defaultCountry?: string;
  readonly defaultCurrency?: string;
  readonly defaultTimezone?: string;
  readonly onError: NonNullable<I18nDetails['onError']>;
  readonly loading: boolean;

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
    public readonly translations: TranslationDictionary[],
    {
      locale,
      currency,
      timezone,
      country,
      pseudolocalize = false,
      onError,
      loading,
    }: I18nDetails & {loading?: boolean},
  ) {
    this.locale = locale;
    this.defaultCountry = country;
    this.defaultCurrency = currency;
    this.defaultTimezone = timezone;
    this.pseudolocalize = pseudolocalize;
    this.onError = onError || defaultOnError;
    this.loading = loading || false;
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

  getTranslationTree(
    id: string,
    replacements?:
      | PrimitiveReplacementDictionary
      | ComplexReplacementDictionary,
  ): string | TranslationDictionary {
    try {
      if (!replacements) {
        return getTranslationTree(id, this.translations, this.locale);
      }
      return getTranslationTree(
        id,
        this.translations,
        this.locale,
        replacements,
      );
    } catch (error) {
      this.onError(error);
      return '';
    }
  }

  translationKeyExists(id: string) {
    try {
      getTranslationTree(id, this.translations, this.locale);
      return true;
    } catch (error) {
      return false;
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
          `formatNumber(amount, {as: 'currency'}) cannot be called without a currency code.`,
        ),
      );

      return '';
    }

    return memoizedNumberFormatter(locale, {
      style: as,
      maximumFractionDigits: precision,
      currency,
      ...options,
    }).format(amount);
  }

  unformatNumber(input: string): string {
    const {thousandSymbol, decimalSymbol} = this.numberSymbols();

    const normalizedValue = normalizedNumber(
      input,
      decimalSymbol,
      thousandSymbol === PERIOD,
    );

    return normalizedValue === '' ? '' : parseFloat(normalizedValue).toString();
  }

  formatCurrency(
    amount: number,
    {form, ...options}: CurrencyFormatOptions = {},
  ) {
    switch (form) {
      case 'auto':
        return this.formatCurrencyAuto(amount, options);
      case 'explicit':
        return this.formatCurrencyExplicit(amount, options);
      case 'short':
        return this.formatCurrencyShort(amount, options);
    }

    return this.formatNumber(amount, {as: 'currency', ...options});
  }

  unformatCurrency(input: string, currencyCode: string): string {
    // This decimal symbol will always be '.' regardless of the locale
    // since it's our internal representation of the string
    const decimalSymbol = this.currencyDecimalSymbol(currencyCode);
    const expectedDecimalSymbol =
      decimalSymbol === DECIMAL_NOT_SUPPORTED ? PERIOD : decimalSymbol;

    const normalizedValue = normalizedNumber(input, expectedDecimalSymbol);

    if (normalizedValue === '') {
      return '';
    }

    if (decimalSymbol === DECIMAL_NOT_SUPPORTED) {
      const roundedAmount = parseFloat(normalizedValue).toFixed(0);
      return `${roundedAmount}.${DECIMAL_VALUE_FOR_CURRENCIES_WITHOUT_DECIMALS}`;
    }

    const decimalPlaces =
      currencyDecimalPlaces.get(currencyCode.toUpperCase()) ||
      DEFAULT_DECIMAL_PLACES;
    return parseFloat(normalizedValue).toFixed(decimalPlaces);
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

    const {style = undefined, ...formatOptions} = options || {};

    if (style) {
      return style === DateStyle.Humanize
        ? this.humanizeDate(date, formatOptions)
        : this.formatDate(date, {...formatOptions, ...dateStyle[style]});
    }

    return formatDate(date, locale, {...formatOptions, timeZone});
  }

  ordinal(amount: number) {
    const {locale} = this;
    const group = memoizedPluralRules(locale, {type: 'ordinal'}).select(amount);
    return this.translate(group, {scope: 'ordinal'}, {amount});
  }

  weekStartDay(argCountry?: I18n['defaultCountry']): Weekday {
    const country = argCountry || this.defaultCountry;

    if (!country) {
      throw new MissingCountryError(
        'weekStartDay() cannot be called without a country code.',
      );
    }

    return WEEK_START_DAYS.get(country) || DEFAULT_WEEK_START_DAY;
  }

  getCurrencySymbol = (currencyCode?: string) => {
    const currency = currencyCode || this.defaultCurrency;
    if (currency == null) {
      throw new MissingCurrencyCodeError(
        'formatCurrency cannot be called without a currency code.',
      );
    }
    return this.getCurrencySymbolLocalized(this.locale, currency);
  };

  getCurrencySymbolLocalized(locale: string, currency: string) {
    return getCurrencySymbol(locale, {currency});
  }

  formatName(firstName: string, lastName?: string, options?: {full?: boolean}) {
    if (!firstName) {
      return lastName || '';
    }
    if (!lastName) {
      return firstName;
    }

    const isFullName = Boolean(options && options.full);

    const customNameFormatter =
      EASTERN_NAME_ORDER_FORMATTERS.get(this.locale) ||
      EASTERN_NAME_ORDER_FORMATTERS.get(this.language);

    if (customNameFormatter) {
      return customNameFormatter(firstName, lastName, isFullName);
    }
    if (isFullName) {
      return `${firstName} ${lastName}`;
    }
    return firstName;
  }

  hasEasternNameOrderFormatter() {
    const easternNameOrderFormatter =
      EASTERN_NAME_ORDER_FORMATTERS.get(this.locale) ||
      EASTERN_NAME_ORDER_FORMATTERS.get(this.language);
    return Boolean(easternNameOrderFormatter);
  }

  private formatCurrencyAuto(
    amount: number,
    options: Intl.NumberFormatOptions = {},
  ): string {
    // use the short format if we can't determine a currency match, or if the
    // currencies match, use explicit when the currencies definitively do not
    // match.
    const formatShort =
      options.currency == null ||
      this.defaultCurrency == null ||
      options.currency === this.defaultCurrency;

    return formatShort
      ? this.formatCurrencyShort(amount, options)
      : this.formatCurrencyExplicit(amount, options);
  }

  private formatCurrencyExplicit(
    amount: number,
    options: Intl.NumberFormatOptions = {},
  ): string {
    const value = this.formatCurrencyShort(amount, options);
    const isoCode = options.currency || this.defaultCurrency || '';
    if (value.includes(isoCode)) {
      return value;
    }
    return `${value} ${isoCode}`;
  }

  private formatCurrencyShort(
    amount: number,
    options: NumberFormatOptions = {},
  ): string {
    const {locale} = this;
    const shortSymbol = this.getShortCurrencySymbol(options.currency);
    let adjustedPrecision = options.precision;
    if (adjustedPrecision === undefined) {
      const currency = options.currency || this.defaultCurrency || '';
      adjustedPrecision = currencyDecimalPlaces.get(currency.toUpperCase());
    }
    const formattedAmount = memoizedNumberFormatter(locale, {
      style: 'decimal',
      minimumFractionDigits: adjustedPrecision,
      maximumFractionDigits: adjustedPrecision,
      ...options,
    }).format(amount);

    const formattedWithSymbol = shortSymbol.prefixed
      ? `${shortSymbol.symbol}${formattedAmount}`
      : `${formattedAmount}${shortSymbol.symbol}`;

    return amount < 0
      ? `-${formattedWithSymbol.replace('-', '')}`
      : formattedWithSymbol;
  }

  // Intl.NumberFormat sometimes annotates the "currency symbol" with a country code.
  // For example, in locale 'fr-FR', 'USD' is given the "symbol" of " $US".
  // This method strips out the country-code annotation, if there is one.
  // (So, for 'fr-FR' and 'USD', the return value would be " $").
  //
  // For other currencies, e.g. CHF and OMR, the "symbol" is the ISO currency code.
  // In those cases, we return the full currency code without stripping the country.
  private getShortCurrencySymbol(currencyCode = this.defaultCurrency || '') {
    const currency = currencyCode || this.defaultCurrency || '';
    const regionCode = currency.substring(0, 2);
    const info = this.getCurrencySymbol(currency);
    const shortSymbol = info.symbol.replace(regionCode, '');
    const alphabeticCharacters = /[A-Za-zÀ-ÖØ-öø-ÿĀ-ɏḂ-ỳ]/;

    return alphabeticCharacters.exec(shortSymbol)
      ? info
      : {symbol: shortSymbol, prefixed: info.prefixed};
  }

  private humanizeDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    if (isFutureDate(date)) {
      return this.humanizeFutureDate(date, options);
    } else {
      return this.humanizePastDate(date, options);
    }
  }

  private humanizePastDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    if (isLessThanOneMinuteAgo(date)) {
      return this.translate('date.humanize.lessThanOneMinuteAgo');
    }

    if (isLessThanOneHourAgo(date)) {
      const now = new Date();
      const minutes = Math.floor(
        (now.getTime() - date.getTime()) / TimeUnit.Minute,
      );
      return this.translate('date.humanize.lessThanOneHourAgo', {
        count: minutes,
      });
    }

    const time = this.formatDate(date, {
      ...options,
      hour: 'numeric',
      minute: '2-digit',
    }).toLocaleLowerCase();

    if (isToday(date)) {
      return time;
    }

    if (isYesterday(date)) {
      return this.translate('date.humanize.yesterday', {time});
    }

    if (isLessThanOneWeekAgo(date)) {
      const weekday = this.formatDate(date, {
        ...options,
        weekday: 'long',
      });
      return this.translate('date.humanize.lessThanOneWeekAgo', {
        weekday,
        time,
      });
    }

    if (isLessThanOneYearAgo(date)) {
      const monthDay = this.formatDate(date, {
        ...options,
        month: 'short',
        day: 'numeric',
      });
      return this.translate('date.humanize.lessThanOneYearAgo', {
        date: monthDay,
        time,
      });
    }

    return this.formatDate(date, {
      ...options,
      style: DateStyle.Short,
    });
  }

  private humanizeFutureDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    const time = this.formatDate(date, {
      ...options,
      hour: 'numeric',
      minute: '2-digit',
    }).toLocaleLowerCase();

    if (isToday(date)) {
      return this.translate('date.humanize.today', {time});
    }

    if (isTomorrow(date)) {
      return this.translate('date.humanize.tomorrow', {time});
    }

    if (isLessThanOneWeekAway(date)) {
      const weekday = this.formatDate(date, {
        ...options,
        weekday: 'long',
      });
      return this.translate('date.humanize.lessThanOneWeekAway', {
        weekday,
        time,
      });
    }

    if (isLessThanOneYearAway(date)) {
      const monthDay = this.formatDate(date, {
        ...options,
        month: 'short',
        day: 'numeric',
      });
      return this.translate('date.humanize.lessThanOneYearAway', {
        date: monthDay,
        time,
      });
    }

    return this.formatDate(date, {
      ...options,
      style: DateStyle.Short,
    });
  }

  private currencyDecimalSymbol(currencyCode: string) {
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

  @memoize()
  private numberSymbols() {
    const formattedNumber = this.formatNumber(123456.7, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
    let thousandSymbol;
    let decimalSymbol;
    for (const char of formattedNumber) {
      if (isNaN(parseInt(char, 10))) {
        if (thousandSymbol) decimalSymbol = char;
        else thousandSymbol = char;
      }
    }
    return {thousandSymbol, decimalSymbol};
  }
}

function normalizedNumber(
  input: string,
  expectedDecimal: string,
  usesPeriodThousandSymbol?: boolean,
) {
  const nonDigits = /\D/g;

  // For locales that use non-period symbols as the decimal symbol, users may still input a period
  // and expect it to be treated as the decimal symbol for their locale.
  const hasExpectedDecimalSymbol = input.lastIndexOf(expectedDecimal) !== -1;
  const hasPeriodAsDecimal = input.lastIndexOf(PERIOD) !== -1;
  const usesPeriodDecimal =
    !usesPeriodThousandSymbol &&
    !hasExpectedDecimalSymbol &&
    hasPeriodAsDecimal;
  const decimalSymbolToUse = usesPeriodDecimal ? PERIOD : expectedDecimal;
  const lastDecimalIndex = input.lastIndexOf(decimalSymbolToUse);

  const integerValue = input
    .substring(0, lastDecimalIndex)
    .replace(nonDigits, '');
  const decimalValue = input
    .substring(lastDecimalIndex + 1)
    .replace(nonDigits, '');

  const normalizedDecimal = lastDecimalIndex === -1 ? '' : PERIOD;
  const normalizedValue = `${integerValue}${normalizedDecimal}${decimalValue}`;

  return normalizedValue === '' || normalizedValue === PERIOD
    ? ''
    : normalizedValue;
}

function isTranslateOptions(
  object:
    | TranslateOptions
    | PrimitiveReplacementDictionary
    | ComplexReplacementDictionary,
): object is TranslateOptions {
  return 'scope' in object;
}

function defaultOnError(error: I18nError) {
  throw error;
}
