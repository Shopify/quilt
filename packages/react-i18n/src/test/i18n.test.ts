import {clock} from '@shopify/jest-dom-mocks';

import './matchers';

import I18n from '../i18n';
import {LanguageDirection} from '../types';
import {DateStyle, Weekdays} from '../constants';

jest.mock('../utilities', () => ({
  translate: jest.fn(),
  getCurrencySymbol: jest.fn(),
}));

const translate: jest.Mock = require('../utilities').translate;
const getCurrencySymbol: jest.Mock = require('../utilities').getCurrencySymbol;

describe('I18n', () => {
  const defaultDetails = {locale: 'en-ca'};
  const defaultTranslations = [{hello: 'Hello, {name}!'}];

  beforeEach(() => {
    translate.mockReset();
    getCurrencySymbol.mockReset();
  });

  describe('#locale', () => {
    it('is exposed publicly', () => {
      const locale = 'fr-ca';
      const i18n = new I18n(defaultTranslations, {locale});
      expect(i18n).toHaveProperty('locale', locale);
    });
  });

  describe('#language', () => {
    it('is determined from the locale', () => {
      const locale = 'fr-ca';
      const i18n = new I18n(defaultTranslations, {locale});
      expect(i18n).toHaveProperty('language', 'fr');
    });
  });

  describe('#languageDirection', () => {
    it('is LanguageDirection.Ltr for LTR languages', () => {
      expect(new I18n(defaultTranslations, {locale: 'en'})).toHaveProperty(
        'languageDirection',
        LanguageDirection.Ltr,
      );
    });

    it('is LanguageDirection.Rtl for RTL languages', () => {
      expect(new I18n(defaultTranslations, {locale: 'ar'})).toHaveProperty(
        'languageDirection',
        LanguageDirection.Rtl,
      );
    });
  });

  describe('#isLtrLanguage', () => {
    it('is true for LTR languages', () => {
      expect(new I18n(defaultTranslations, {locale: 'en'})).toHaveProperty(
        'isLtrLanguage',
        true,
      );
    });

    it('is false for RTL languages', () => {
      expect(new I18n(defaultTranslations, {locale: 'ar'})).toHaveProperty(
        'isLtrLanguage',
        false,
      );
    });
  });

  describe('#isRtlLanguage', () => {
    it('is false for LTR languages', () => {
      expect(new I18n(defaultTranslations, {locale: 'en'})).toHaveProperty(
        'isRtlLanguage',
        false,
      );
    });

    it('is true for RTL languages', () => {
      expect(new I18n(defaultTranslations, {locale: 'ar'})).toHaveProperty(
        'isRtlLanguage',
        true,
      );
    });
  });

  describe('#region', () => {
    it('is determined from the locale', () => {
      const locale = 'fr-ca';
      const i18n = new I18n(defaultTranslations, {locale});
      expect(i18n).toHaveProperty('region', 'CA');
    });

    it('is undefined when the locale does not have a country code', () => {
      const locale = 'fr';
      const i18n = new I18n(defaultTranslations, {locale});
      // eslint-disable-next-line no-undefined
      expect(i18n).toHaveProperty('region', undefined);
    });
  });

  describe('#countryCode', () => {
    it('is determined from the locale', () => {
      const locale = 'fr-ca';
      const i18n = new I18n(defaultTranslations, {locale});
      expect(i18n).toHaveProperty('countryCode', 'CA');
    });

    it('is undefined when the locale does not have a country code', () => {
      const locale = 'fr';
      const i18n = new I18n(defaultTranslations, {locale});
      // eslint-disable-next-line no-undefined
      expect(i18n).toHaveProperty('countryCode', undefined);
    });
  });

  describe('#defaultCurrency', () => {
    it('is exposed publicly', () => {
      const defaultCurrency = 'CAD';
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        currency: defaultCurrency,
      });
      expect(i18n).toHaveProperty('defaultCurrency', defaultCurrency);
    });
  });

  describe('#defaultTimezone', () => {
    it('is exposed publicly', () => {
      const defaultTimezone = 'EST';
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });
      expect(i18n).toHaveProperty('defaultTimezone', defaultTimezone);
    });
  });

  describe('#translate()', () => {
    it('calls the translate() utility with translations, key, locale, scope, pseudotranslate, and replacements', () => {
      const mockResult = 'translated string';
      const replacements = {name: 'Chris'};
      const scope = {scope: 'goodbye'};
      translate.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.translate('hello', scope, replacements);

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        {...scope, replacements, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );
    });

    it('calls the translate() utility when no scope is provided', () => {
      const mockResult = 'translated string';
      const replacements = {name: 'Chris'};
      translate.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.translate('hello', replacements);

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        {replacements, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );
    });

    it('calls the translate() utility when no replacements are provided', () => {
      const mockResult = 'translated string';
      const scope = {scope: 'goodbye'};
      translate.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.translate('hello', scope);

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        {...scope, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );
    });

    it('calls the translate() utility when no replacements or scope are provided', () => {
      const mockResult = 'translated string';
      translate.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.translate('hello');

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        {pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );
    });

    it('calls the translate utility with pseudotranslation', () => {
      const mockResult = 'translated string';
      translate.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        pseudolocalize: true,
      });
      const result = i18n.translate('hello');

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        {pseudotranslate: true},
        defaultTranslations,
        i18n.locale,
      );
    });
  });

  describe('#formatNumber()', () => {
    it('formats a number using Intl', () => {
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = new Intl.NumberFormat(defaultDetails.locale).format(
        1000,
      );

      expect(i18n.formatNumber(1000)).toBe(expected);
    });

    it('uses the precision argument for maximumFractionDigits', () => {
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const precision = 2;
      const expected = new Intl.NumberFormat(defaultDetails.locale, {
        maximumFractionDigits: precision,
      }).format(0.12345);

      expect(i18n.formatNumber(0.12345, {precision})).toBe(expected);
    });

    it('passes additional options to the number formatter', () => {
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const options: Partial<Intl.NumberFormatOptions> = {
        currencyDisplay: 'code',
        minimumIntegerDigits: 1,
        maximumFractionDigits: 1,
      };

      const expected = new Intl.NumberFormat(
        defaultDetails.locale,
        options,
      ).format(0.12345);

      expect(i18n.formatNumber(0.12345, options)).toBe(expected);
    });

    describe('currency', () => {
      const currency = 'USD';

      it('throws an error when no currency code is given as the default or as an option', () => {
        const i18n = new I18n(defaultTranslations, defaultDetails);
        expect(() => i18n.formatNumber(1, {as: 'currency'})).toThrowError(
          'No currency code provided.',
        );
      });

      it('uses the Intl number formatter with the default currency', () => {
        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          currency,
        });

        const expected = Intl.NumberFormat(defaultDetails.locale, {
          style: 'currency',
          currency,
        }).format(1);

        expect(i18n.formatNumber(1, {as: 'currency'})).toBe(expected);
      });

      it('uses a custom currency provided in options', () => {
        const i18n = new I18n(defaultTranslations, defaultDetails);
        const expected = Intl.NumberFormat(defaultDetails.locale, {
          style: 'currency',
          currency,
        }).format(1);

        expect(i18n.formatNumber(1, {as: 'currency', currency})).toBe(expected);
      });

      it('passes additional options to the number formatter', () => {
        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          currency,
        });

        const options: Partial<Intl.NumberFormatOptions> = {
          currencyDisplay: 'code',
          minimumIntegerDigits: 1,
        };

        const expected = Intl.NumberFormat(defaultDetails.locale, {
          style: 'currency',
          currency,
          ...options,
        }).format(1);

        expect(i18n.formatNumber(1, {as: 'currency', ...options})).toBe(
          expected,
        );
      });
    });

    describe('percent', () => {
      it('formats the number as a percentage', () => {
        const i18n = new I18n(defaultTranslations, defaultDetails);
        const expected = Intl.NumberFormat(defaultDetails.locale, {
          style: 'percent',
        }).format(50);
        expect(i18n.formatNumber(50, {as: 'percent'})).toBe(expected);
      });
    });
  });

  describe('#formatCurrency()', () => {
    const currency = 'USD';

    it('formats the number as a currency', () => {
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = Intl.NumberFormat(defaultDetails.locale, {
        style: 'currency',
        currency,
      }).format(1);

      expect(i18n.formatCurrency(1, {currency})).toBe(expected);
    });
  });

  describe('#unformatCurrency()', () => {
    const mockSymbolResult = {
      symbol: '$',
      prefixed: true,
    };

    it('handles formatted USD input', () => {
      getCurrencySymbol.mockReturnValue(mockSymbolResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(i18n.unformatCurrency('1,234.50', 'USD')).toBe('1234.50');
      expect(i18n.unformatCurrency('1', 'USD')).toBe('1.00');
    });

    describe('prefixed symbols', () => {
      it('handles prefix with a space', () => {
        getCurrencySymbol.mockReturnValue(mockSymbolResult);

        const i18n = new I18n(defaultTranslations, defaultDetails);
        expect(i18n.unformatCurrency('$ 1,234.50', 'USD')).toBe('1234.50');
      });

      it('handles prefix without a space', () => {
        getCurrencySymbol.mockReturnValue(mockSymbolResult);

        const i18n = new I18n(defaultTranslations, defaultDetails);
        expect(i18n.unformatCurrency('$1,234.50', 'USD')).toBe('1234.50');
      });
    });

    it('unformats formatted input to 2 digits', () => {
      getCurrencySymbol.mockReturnValue(mockSymbolResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(i18n.unformatCurrency('1,234.555', 'USD')).toBe('1234.56');
      expect(i18n.unformatCurrency('1,234.006', 'USD')).toBe('1234.01');
    });

    it('unformats formatted input with symbols', () => {
      getCurrencySymbol.mockReturnValue(mockSymbolResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(i18n.unformatCurrency('$1,234.50', 'USD')).toBe('1234.50');
    });

    it('handles value starting with ,', () => {
      getCurrencySymbol.mockReturnValue(mockSymbolResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(i18n.unformatCurrency(',12', 'USD')).toBe('12.00');
    });

    it('handles value starting with .', () => {
      getCurrencySymbol.mockReturnValue(mockSymbolResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(i18n.unformatCurrency('.12', 'USD')).toBe('0.12');
    });

    it('handles value starting with ', () => {
      getCurrencySymbol.mockReturnValue(mockSymbolResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(i18n.unformatCurrency("'12", 'USD')).toBe('12.00');
    });

    describe('unique currencies or locales', () => {
      let formatCurrency: jest.SpyInstance;

      beforeEach(() => {
        formatCurrency = jest.spyOn(I18n.prototype, 'formatCurrency');
      });

      afterEach(() => {
        formatCurrency.mockReset();
      });

      it('handles locales with comma as decimal symbol', () => {
        formatCurrency.mockImplementationOnce(() => 'US$ 1,00');
        getCurrencySymbol.mockReturnValue({
          symbol: 'US$',
          prefixed: true,
        });

        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          locale: 'pt-BR',
        });
        expect(i18n.unformatCurrency('1.234,56', 'USD')).toBe('1234.56');
      });

      it('handles currencies without digits', () => {
        formatCurrency.mockImplementationOnce(() => 'JP¥ 1');
        getCurrencySymbol.mockReturnValue({
          symbol: 'JP¥',
          prefixed: true,
        });

        const i18n = new I18n(defaultTranslations, {...defaultDetails});
        expect(i18n.unformatCurrency('8,141.23', 'JPY')).toBe('8141.00');
      });

      it('rounds currencies without digits to the greatest whole integer', () => {
        formatCurrency.mockImplementationOnce(() => 'JP¥ 1');
        getCurrencySymbol.mockReturnValue({
          symbol: 'JP¥',
          prefixed: true,
        });

        const i18n = new I18n(defaultTranslations, {...defaultDetails});
        expect(i18n.unformatCurrency('8,141.99', 'JPY')).toBe('8142.00');
      });

      it('handles currencies with 3 decimal places', () => {
        formatCurrency.mockImplementationOnce(() => 'JOD 1.000');
        getCurrencySymbol.mockReturnValue({
          symbol: 'JOD',
          prefixed: true,
        });

        const i18n = new I18n(defaultTranslations, {...defaultDetails});
        expect(i18n.unformatCurrency('JOD 123.34', 'JOD')).toBe('123.340');
      });

      it('rounds currencies with 3 decimal places', () => {
        formatCurrency.mockImplementationOnce(() => 'JOD 1.000');
        getCurrencySymbol.mockReturnValue({
          symbol: 'JOD',
          prefixed: true,
        });

        const i18n = new I18n(defaultTranslations, {...defaultDetails});
        expect(i18n.unformatCurrency('123.9999', 'JOD')).toBe('124.000');
      });

      it('handles EUR currency with fr locale', () => {
        formatCurrency.mockImplementationOnce(() => '1,00 €');
        getCurrencySymbol.mockReturnValue({
          symbol: '€',
          prefixed: false,
        });

        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          locale: 'fr',
        });
        expect(i18n.unformatCurrency('1 233,45', 'EUR')).toBe('1233.45');
      });

      it('handles EUR currency with en-gb locale', () => {
        formatCurrency.mockImplementationOnce(() => '€1.00');
        getCurrencySymbol.mockReturnValue({
          symbol: '€',
          prefixed: true,
        });

        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          locale: 'en-gb',
        });
        expect(i18n.unformatCurrency('1,233.45', 'EUR')).toBe('1233.45');
      });
    });
  });

  describe('#formatPercentage()', () => {
    it('formats the number as a percentage', () => {
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = Intl.NumberFormat(defaultDetails.locale, {
        style: 'percent',
      }).format(50);
      expect(i18n.formatPercentage(50)).toBe(expected);
    });
  });

  describe('#formatDate()', () => {
    const defaultTimezone = 'Australia/Sydney';

    afterEach(() => {
      if (clock.isMocked()) {
        clock.restore();
      }
    });

    it('formats a date using Intl', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });
      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: defaultTimezone,
      }).format(date);
      expect(i18n.formatDate(date)).toBe(expected);
    });

    it('passes additional options to the date formatter', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });
      const options: Partial<Intl.DateTimeFormatOptions> = {
        era: 'narrow',
      };

      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: defaultTimezone,
        ...options,
      }).format(date);

      expect(i18n.formatDate(date, options)).toBe(expected);
    });

    it('formats a date using Intl when no timezone is given as the default or as an option', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = new Intl.DateTimeFormat(
        defaultDetails.locale,
        {},
      ).format(date);
      expect(i18n.formatDate(date)).toBe(expected);
    });

    it('uses the Intl number formatter with the default timezone', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: defaultTimezone,
      }).format(date);

      expect(i18n.formatDate(date)).toBe(expected);
    });

    it('uses a custom timezone provided in options', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: defaultTimezone,
      }).format(date);

      expect(i18n.formatDate(date, {timeZone: defaultTimezone})).toBe(expected);
    });

    it('uses UTC when given a date in the Etc/GMT+12 timezone', () => {
      const date = new Date('2018-01-01T12:34:56-12:00');
      const timeZone = 'Etc/GMT+12';

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: 'UTC',
      }).format(new Date('2018-01-01'));

      expect(i18n.formatDate(date, {timeZone})).toBe(expected);
    });

    it('uses UTC when defaultTimezone is Etc/GMT+12', () => {
      const date = new Date('2018-01-01T12:34:56-12:00');
      const defaultTimezone = 'Etc/GMT+12';

      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });
      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: 'UTC',
      }).format(new Date('2018-01-01'));

      expect(
        i18n.formatDate(date, {
          timeZone: defaultTimezone,
        }),
      ).toBe(expected);
    });

    it('formats a date using DateStyle.Long', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Long})).toBe(
        'Thursday, December 20, 2012',
      );
    });

    it('formats a date using DateStyle.Short', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Short})).toBe(
        'Dec 20, 2012',
      );
    });

    it('formats a date using DateStyle.Humanize', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Humanize})).toBe(
        'December 20, 2012',
      );
    });

    it('formats a date using DateStyle.Humanize in a custom timezone', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, defaultDetails);

      expect(
        i18n.formatDate(date, {
          style: DateStyle.Humanize,
          timeZone: defaultTimezone,
        }),
      ).toBe('December 20, 2012');
    });

    it('formats today using DateStyle.Humanize', () => {
      const today = new Date('2012-12-20T00:00:00-00:00');
      clock.mock(today);
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      expect(i18n.formatDate(today, {style: DateStyle.Humanize})).toBe(
        i18n.translate('today'),
      );
    });

    it('formats yesterday using DateStyle.Humanize', () => {
      const today = new Date('2012-12-20T00:00:00-00:00');
      const yesterday = new Date('2012-12-19T00:00:00-00:00');
      clock.mock(today);
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      expect(i18n.formatDate(yesterday, {style: DateStyle.Humanize})).toBe(
        i18n.translate('yesterday'),
      );
    });

    it('formats a date using DateStyle.Time', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Time})).toBe('11:00 AM');
    });
  });

  describe('#weekStartDay()', () => {
    it('uses the defaultCountry to get the week start day', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en', country: 'FR'});

      expect(i18n.weekStartDay()).toBe(Weekdays.Monday);
    });

    it('uses the country passed in the params instead of the defaultCountry', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en', country: 'FR'});

      expect(i18n.weekStartDay('CA')).toBe(Weekdays.Sunday);
    });

    it('fallsback to Sunday if country is not in the list', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en', country: 'XX'});

      expect(i18n.weekStartDay()).toBe(Weekdays.Sunday);
    });

    it('throws an error if no country code is passed', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(() => i18n.weekStartDay()).toThrowError(
        'No country code provided. weekStartDay() cannot be called without a country code.',
      );
    });
  });

  describe('#getCurrencySymbol()', () => {
    it('correctly returns the locale-specific currency symbol and its position', () => {
      const mockResult = {
        symbol: '€',
        prefixed: true,
      };
      getCurrencySymbol.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.getCurrencySymbol('eur')).toEqual(mockResult);
    });
  });
});
