import {clock} from '@shopify/jest-dom-mocks';

import './matchers';

import {I18n} from '../i18n';
import {LanguageDirection} from '../types';
import {DateStyle, Weekday} from '../constants';
import {MissingTranslationError} from '../errors';

jest.mock('../utilities', () => ({
  ...require.requireActual('../utilities'),
  translate: jest.fn(),
  getTranslationTree: jest.fn(),
  getCurrencySymbol: jest.fn(),
}));

const translate: jest.Mock = require('../utilities').translate;
const getTranslationTree: jest.Mock = require('../utilities')
  .getTranslationTree;
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

  describe('#loading', () => {
    it('is exposed publicly', () => {
      const locale = 'en';
      const i18n = new I18n(defaultTranslations, {locale, loading: true});
      expect(i18n).toHaveProperty('loading', true);
    });

    it('defaults to false', () => {
      const locale = 'en';
      const i18n = new I18n(defaultTranslations, {locale});
      expect(i18n).toHaveProperty('loading', false);
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

  describe('#getTranslationTree()', () => {
    it('calls the getTranslationTree() utility with translations, key, locale, scope, pseudotranslate, and replacements', () => {
      const mockResult = {foo: 'bar'};
      getTranslationTree.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.getTranslationTree('hello');

      expect(result).toBe(mockResult);
      expect(getTranslationTree).toHaveBeenCalledWith(
        'hello',
        defaultTranslations,
        i18n.locale,
      );
    });

    it('rethrows a missing translation error by default', () => {
      const key = 'hello';
      const error = new MissingTranslationError(key, defaultDetails.locale);
      getTranslationTree.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(() => i18n.getTranslationTree(key)).toThrow(error);
    });

    it('rethrows a missing translation error with the missing key message', () => {
      const key = 'hello';
      const error = new MissingTranslationError(key, defaultDetails.locale);
      getTranslationTree.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(() => i18n.getTranslationTree(key)).toThrow(
        `Missing translation for key: ${key}`,
      );
    });

    it('calls an onError handler', () => {
      const key = 'hello';
      const spy = jest.fn();
      const error = new MissingTranslationError(key, defaultDetails.locale);
      getTranslationTree.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        onError: spy,
      });

      i18n.getTranslationTree(key);

      expect(spy).toHaveBeenCalledWith(error);
    });

    it('returns an empty string when an onError handler does not rethrow', () => {
      const key = 'key';
      getTranslationTree.mockImplementation(() => {
        throw new MissingTranslationError(key, defaultDetails.locale);
      });

      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        onError: () => {},
      });

      expect(i18n.getTranslationTree(key)).toBe('');
    });
  });

  describe('#ordinal()', () => {
    it('calls translate() utility with ordinal scope and replacement amount', () => {
      const defaultTranslations = [{hello: 'Hello, {name}!'}];
      const i18n = new I18n(defaultTranslations, defaultDetails);

      i18n.ordinal(0);
      expect(translate).toHaveBeenCalledWith(
        'other',
        {scope: 'ordinal', replacements: {amount: 0}, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );

      i18n.ordinal(1);
      expect(translate).toHaveBeenCalledWith(
        'one',
        {scope: 'ordinal', replacements: {amount: 1}, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );

      i18n.ordinal(2);
      expect(translate).toHaveBeenCalledWith(
        'two',
        {scope: 'ordinal', replacements: {amount: 2}, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );

      i18n.ordinal(3);
      expect(translate).toHaveBeenCalledWith(
        'few',
        {scope: 'ordinal', replacements: {amount: 3}, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );

      i18n.ordinal(4);
      expect(translate).toHaveBeenCalledWith(
        'other',
        {scope: 'ordinal', replacements: {amount: 4}, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );

      i18n.ordinal(42);
      expect(translate).toHaveBeenCalledWith(
        'two',
        {scope: 'ordinal', replacements: {amount: 42}, pseudotranslate: false},
        defaultTranslations,
        i18n.locale,
      );
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

    it('rethrows a missing translation error by default', () => {
      const key = 'hello';
      const error = new MissingTranslationError(key, defaultDetails.locale);
      translate.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(() => i18n.translate(key)).toThrow(error);
    });

    it('rethrows a missing translation error with the missing key message', () => {
      const key = 'hello';
      const error = new MissingTranslationError(key, defaultDetails.locale);
      translate.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, defaultDetails);
      expect(() => i18n.translate(key)).toThrow(
        `Missing translation for key: ${key}`,
      );
    });

    it('calls an onError handler', () => {
      const key = 'hello';
      const spy = jest.fn();
      const error = new MissingTranslationError(key, defaultDetails.locale);
      translate.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        onError: spy,
      });

      i18n.translate(key);

      expect(spy).toHaveBeenCalledWith(error);
    });

    it('returns an empty string when an onError handler does not rethrow', () => {
      const key = 'hello';
      translate.mockImplementation(() => {
        throw new MissingTranslationError(key, defaultDetails.locale);
      });

      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        onError: () => {},
      });

      expect(i18n.translate(key)).toBe('');
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

    it('updates format on multiple calls', () => {
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

      const newOptions: Partial<Intl.NumberFormatOptions> = {
        currencyDisplay: 'symbol',
        minimumIntegerDigits: 1,
        maximumFractionDigits: 1,
      };
      const expectedWithNewOptions = new Intl.NumberFormat(
        defaultDetails.locale,
        newOptions,
      ).format(0.12345);

      expect(i18n.formatNumber(0.12345, newOptions)).toBe(
        expectedWithNewOptions,
      );
    });

    describe('currency', () => {
      const currency = 'USD';

      it('throws an error when no currency code is given as the default or as an option', () => {
        const i18n = new I18n(defaultTranslations, defaultDetails);
        expect(() => i18n.formatNumber(1, {as: 'currency'})).toThrow(
          'No currency code provided.',
        );
      });

      it('calls the onError callback with an error when no currency code is given', () => {
        const spy = jest.fn();
        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          onError: spy,
        });

        i18n.formatNumber(1, {as: 'currency'});
        expect(spy).toHaveBeenCalledWith(expect.any(Error));
      });

      it('returns an empty string when an error handler does not rethrow the error', () => {
        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          onError: () => {},
        });
        expect(i18n.formatNumber(1, {as: 'currency'})).toBe('');
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

  describe('#unformatNumber()', () => {
    let formatNumber: jest.SpyInstance;
    let i18n: I18n;

    beforeAll(() => {
      formatNumber = jest.spyOn(I18n.prototype, 'formatNumber');
    });

    beforeEach(() => {
      i18n = new I18n(defaultTranslations, defaultDetails);
    });

    afterEach(() => {
      formatNumber.mockClear();
    });

    afterAll(() => {
      formatNumber.mockRestore();
    });

    const input = 123456.7891;

    it('handles number with period decimal symbol', () => {
      formatNumber.mockImplementationOnce(() => '123,456.7');

      const formatted = '123,456.7891';

      expect(i18n.unformatNumber(formatted)).toBe(input.toString());
    });

    it('handles number with comma decimal symbol', () => {
      formatNumber.mockImplementationOnce(() => '123.456,7');

      const formatted = '123.456,7891';

      expect(i18n.unformatNumber(formatted)).toBe(input.toString());
    });

    it('handles number with space as the thousand symbol', () => {
      formatNumber.mockImplementationOnce(() => '123 456,7');

      const formatted = '123 456,7891';

      expect(i18n.unformatNumber(formatted)).toBe(input.toString());
    });

    it('handles number with unusual comma separators and period decimal symbol', () => {
      formatNumber.mockImplementationOnce(() => '123,456.7');

      const formatted = '1,23,456.7891';

      expect(i18n.unformatNumber(formatted)).toBe(input.toString());
    });

    it('handles invalid value', () => {
      formatNumber.mockImplementationOnce(() => '123,456.7');

      const formatted = 'foobar';

      expect(i18n.unformatNumber(formatted)).toBe('');
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

  describe('#formatCurrencyAuto()', () => {
    const amount = 1234;
    const currency = 'USD';
    const symbolInfo = {symbol: '$', prefixed: true};

    it('formats short when there is no currency in the options', () => {
      getCurrencySymbol.mockReturnValue(symbolInfo);
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        currency,
      });

      expect(i18n.formatCurrency(amount, {form: 'auto'})).toBe(
        i18n.formatCurrency(amount, {form: 'short'}),
      );
    });

    it('formats short when there is no default currency', () => {
      getCurrencySymbol.mockReturnValue(symbolInfo);
      const i18n = new I18n(defaultTranslations, defaultDetails);

      expect(i18n.formatCurrency(amount, {form: 'auto', currency})).toBe(
        i18n.formatCurrency(amount, {form: 'short', currency}),
      );
    });

    it('formats short when the default currency matches the options currency', () => {
      getCurrencySymbol.mockReturnValue(symbolInfo);
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        currency,
      });

      expect(i18n.formatCurrency(amount, {form: 'auto', currency})).toBe(
        i18n.formatCurrency(amount, {form: 'short', currency}),
      );
    });

    it('formats explicit when the default currency does not match the options currency', () => {
      getCurrencySymbol.mockReturnValue(symbolInfo);
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        currency,
      });

      expect(i18n.formatCurrency(amount, {form: 'auto', currency: 'CAD'})).toBe(
        i18n.formatCurrency(amount, {form: 'explicit', currency: 'CAD'}),
      );
    });
  });

  describe('#formatCurrencyExplicit()', () => {
    it.each`
      locale     | currency | symbol    | prefixed | expected
      ${'cs-CZ'} | ${'CZK'} | ${' Kč'}  | ${false} | ${'1 234,56 Kč CZK'}
      ${'de-AT'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'€ 1 234,56 EUR'}
      ${'de-AT'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'¥ 1 235 JPY'}
      ${'de-AT'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'OMR 1 234,560'}
      ${'de-AT'} | ${'USD'} | ${'$ '}   | ${true}  | ${'$ 1 234,56 USD'}
      ${'en-US'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'€ 1,234.56 EUR'}
      ${'en-US'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'¥ 1,235 JPY'}
      ${'en-US'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'OMR 1,234.560'}
      ${'en-US'} | ${'USD'} | ${'$ '}   | ${true}  | ${'$ 1,234.56 USD'}
      ${'fr-FR'} | ${'EUR'} | ${' €'}   | ${false} | ${'1 234,56 € EUR'}
      ${'fr-FR'} | ${'JPY'} | ${' JPY'} | ${false} | ${'1 235 JPY'}
      ${'fr-FR'} | ${'OMR'} | ${' OMR'} | ${false} | ${'1 234,560 OMR'}
      ${'fr-FR'} | ${'USD'} | ${' $US'} | ${false} | ${'1 234,56 $ USD'}
    `(
      'formats 1234.56 of $currency in $locale to expected $expected',
      ({locale, currency, symbol, prefixed, expected}) => {
        const amount = 1234.56;
        const mockSymbolResult = {symbol, prefixed};

        getCurrencySymbol.mockReturnValue(mockSymbolResult);

        const i18n = new I18n(defaultTranslations, {locale});
        expect(i18n.formatCurrencyExplicit(amount, {currency})).toBe(expected);
      },
    );
  });

  describe('#formatCurrencyExplicit() with negative amount', () => {
    it.each`
      locale     | currency | symbol    | prefixed | expected
      ${'cs-CZ'} | ${'CZK'} | ${' Kč'}  | ${false} | ${'-1 234,56 Kč CZK'}
      ${'de-AT'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'-€ 1 234,56 EUR'}
      ${'de-AT'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'-¥ 1 235 JPY'}
      ${'de-AT'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'-OMR 1 234,560'}
      ${'de-AT'} | ${'USD'} | ${'$ '}   | ${true}  | ${'-$ 1 234,56 USD'}
      ${'en-US'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'-€ 1,234.56 EUR'}
      ${'en-US'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'-¥ 1,235 JPY'}
      ${'en-US'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'-OMR 1,234.560'}
      ${'en-US'} | ${'USD'} | ${'$ '}   | ${true}  | ${'-$ 1,234.56 USD'}
      ${'fr-FR'} | ${'EUR'} | ${' €'}   | ${false} | ${'-1 234,56 € EUR'}
      ${'fr-FR'} | ${'JPY'} | ${' JPY'} | ${false} | ${'-1 235 JPY'}
      ${'fr-FR'} | ${'OMR'} | ${' OMR'} | ${false} | ${'-1 234,560 OMR'}
      ${'fr-FR'} | ${'USD'} | ${' $US'} | ${false} | ${'-1 234,56 $ USD'}
    `(
      'formats -1234.56 of $currency in $locale to expected $expected',
      ({locale, currency, symbol, prefixed, expected}) => {
        const amount = -1234.56;
        const mockSymbolResult = {symbol, prefixed};

        getCurrencySymbol.mockReturnValue(mockSymbolResult);

        const i18n = new I18n(defaultTranslations, {locale});
        expect(i18n.formatCurrencyExplicit(amount, {currency})).toBe(expected);
      },
    );
  });

  describe('#formatCurrencyShort()', () => {
    it.each`
      locale     | currency | symbol    | prefixed | expected
      ${'cs-CZ'} | ${'CZK'} | ${' Kč'}  | ${false} | ${'1 234,56 Kč'}
      ${'de-AT'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'€ 1 234,56'}
      ${'de-AT'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'¥ 1 235'}
      ${'de-AT'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'OMR 1 234,560'}
      ${'de-AT'} | ${'USD'} | ${'$ '}   | ${true}  | ${'$ 1 234,56'}
      ${'en-US'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'€ 1,234.56'}
      ${'en-US'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'¥ 1,235'}
      ${'en-US'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'OMR 1,234.560'}
      ${'en-US'} | ${'USD'} | ${'$ '}   | ${true}  | ${'$ 1,234.56'}
      ${'fr-FR'} | ${'EUR'} | ${' €'}   | ${false} | ${'1 234,56 €'}
      ${'fr-FR'} | ${'JPY'} | ${' JPY'} | ${false} | ${'1 235 JPY'}
      ${'fr-FR'} | ${'OMR'} | ${' OMR'} | ${false} | ${'1 234,560 OMR'}
      ${'fr-FR'} | ${'USD'} | ${' $US'} | ${false} | ${'1 234,56 $'}
    `(
      'formats 1234.56 of $currency in $locale to expected $expected',
      ({locale, currency, symbol, prefixed, expected}) => {
        const amount = 1234.56;
        const mockSymbolResult = {symbol, prefixed};

        getCurrencySymbol.mockReturnValue(mockSymbolResult);

        const i18n = new I18n(defaultTranslations, {locale});
        expect(i18n.formatCurrencyShort(amount, {currency})).toBe(expected);
      },
    );
  });

  describe('#formatCurrencyShort() with negative amount', () => {
    it.each`
      locale     | currency | symbol    | prefixed | expected
      ${'cs-CZ'} | ${'CZK'} | ${' Kč'}  | ${false} | ${'-1 234,56 Kč'}
      ${'de-AT'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'-€ 1 234,56'}
      ${'de-AT'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'-¥ 1 235'}
      ${'de-AT'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'-OMR 1 234,560'}
      ${'de-AT'} | ${'USD'} | ${'$ '}   | ${true}  | ${'-$ 1 234,56'}
      ${'en-US'} | ${'EUR'} | ${'€ '}   | ${true}  | ${'-€ 1,234.56'}
      ${'en-US'} | ${'JPY'} | ${'¥ '}   | ${true}  | ${'-¥ 1,235'}
      ${'en-US'} | ${'OMR'} | ${'OMR '} | ${true}  | ${'-OMR 1,234.560'}
      ${'en-US'} | ${'USD'} | ${'$ '}   | ${true}  | ${'-$ 1,234.56'}
      ${'fr-FR'} | ${'EUR'} | ${' €'}   | ${false} | ${'-1 234,56 €'}
      ${'fr-FR'} | ${'JPY'} | ${' JPY'} | ${false} | ${'-1 235 JPY'}
      ${'fr-FR'} | ${'OMR'} | ${' OMR'} | ${false} | ${'-1 234,560 OMR'}
      ${'fr-FR'} | ${'USD'} | ${' $US'} | ${false} | ${'-1 234,56 $'}
    `(
      'formats -1234.56 of $currency in $locale to expected $expected',
      ({locale, currency, symbol, prefixed, expected}) => {
        const amount = -1234.56;
        const mockSymbolResult = {symbol, prefixed};

        getCurrencySymbol.mockReturnValue(mockSymbolResult);

        const i18n = new I18n(defaultTranslations, {locale});
        expect(i18n.formatCurrencyShort(amount, {currency})).toBe(expected);
      },
    );
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

    it('handles value starting with', () => {
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

      describe('fr locale', () => {
        it('treats , as the decimal symbol', () => {
          formatCurrency.mockImplementationOnce(() => '1,00 $');
          getCurrencySymbol.mockReturnValue({
            symbol: '$',
            prefixed: false,
          });

          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            locale: 'fr',
          });
          expect(i18n.unformatCurrency('1 234,50', 'USD')).toBe('1234.50');
        });

        it('treats . as the decimal symbol if , is not used as a decimal symbol', () => {
          formatCurrency.mockImplementationOnce(() => '1,00 $');
          getCurrencySymbol.mockReturnValue({
            symbol: '$',
            prefixed: false,
          });

          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            locale: 'fr',
          });
          expect(i18n.unformatCurrency('1234.50', 'USD')).toBe('1234.50');
        });
      });
      describe('it locale', () => {
        it('treats , as the decimal symbol', () => {
          formatCurrency.mockImplementationOnce(() => '1,00 $');
          getCurrencySymbol.mockReturnValue({
            symbol: '$',
            prefixed: false,
          });

          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            locale: 'it',
          });
          expect(i18n.unformatCurrency('1.234,50', 'USD')).toBe('1234.50');
        });

        it('treats . as the decimal symbol if , is not used as a decimal symbol', () => {
          formatCurrency.mockImplementationOnce(() => '1,00 $');
          getCurrencySymbol.mockReturnValue({
            symbol: '$',
            prefixed: false,
          });

          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            locale: 'it',
          });
          expect(i18n.unformatCurrency('1234.50', 'USD')).toBe('1234.50');
        });
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
    const timezone = 'Australia/Sydney';

    afterEach(() => {
      if (clock.isMocked()) {
        clock.restore();
      }
    });

    it('formats a date using Intl', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, {...defaultDetails, timezone});
      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: timezone,
      }).format(date);
      expect(i18n.formatDate(date)).toBe(expected);
    });

    it('passes additional options to the date formatter', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, {...defaultDetails, timezone});
      const options: Partial<Intl.DateTimeFormatOptions> = {
        era: 'narrow',
      };

      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: timezone,
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
        timezone,
      });

      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: timezone,
      }).format(date);

      expect(i18n.formatDate(date)).toBe(expected);
    });

    it('uses a custom timezone provided in options', () => {
      const date = new Date();
      const i18n = new I18n(defaultTranslations, defaultDetails);
      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: timezone,
      }).format(date);

      expect(i18n.formatDate(date, {timeZone: timezone})).toBe(expected);
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

    it('formats a date using DateStyle.Long', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Long})).toBe(
        'Thursday, December 20, 2012',
      );
    });

    it('formats a date using DateStyle.Short', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Short})).toBe(
        'Dec. 20, 2012',
      );
    });

    describe('with DateStyle.Humanize', () => {
      it('formats a date', () => {
        const date = new Date('2012-12-20T00:00:00-00:00');
        const i18n = new I18n(defaultTranslations, {
          ...defaultDetails,
          timezone,
        });

        expect(i18n.formatDate(date, {style: DateStyle.Humanize})).toBe(
          'Dec. 20, 2012',
        );
      });

      it('formats a date in a custom timezone', () => {
        const date = new Date('2012-12-20T00:00:00-00:00');
        const i18n = new I18n(defaultTranslations, defaultDetails);

        expect(
          i18n.formatDate(date, {
            style: DateStyle.Humanize,
            timeZone: timezone,
          }),
        ).toBe('Dec. 20, 2012');
      });

      describe('past dates', () => {
        it('formats a date less than one minute ago', () => {
          const today = new Date('2012-12-20T00:00:00-00:00');
          const lessThanOneMinuteAgo = new Date(today.getTime());
          lessThanOneMinuteAgo.setSeconds(-5);
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(lessThanOneMinuteAgo, {
            style: DateStyle.Humanize,
          });
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.lessThanOneMinuteAgo',
            {pseudotranslate: false},
            defaultTranslations,
            i18n.locale,
          );
        });

        it('formats a date less than one hour ago', () => {
          const today = new Date('2012-12-20T00:00:00-00:00');
          const lessThanOneHourAgo = new Date(today.getTime());
          const minutesAgo = 5;
          lessThanOneHourAgo.setMinutes(-minutesAgo);
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(lessThanOneHourAgo, {
            style: DateStyle.Humanize,
          });
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.lessThanOneHourAgo',
            {pseudotranslate: false, replacements: {count: minutesAgo}},
            defaultTranslations,
            i18n.locale,
          );
        });

        it('formats a date from today', () => {
          const today = new Date('2012-12-20T23:00:00-00:00');
          const moreThanOneHourAgo = new Date(today.getTime());
          const hoursAgo = 5;
          moreThanOneHourAgo.setHours(today.getHours() - hoursAgo);
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          expect(
            i18n.formatDate(moreThanOneHourAgo, {style: DateStyle.Humanize}),
          ).toBe('5:00 a.m.');
        });

        it('formats a date from yesterday', () => {
          const today = new Date('2012-12-20T00:00:00-00:00');
          const yesterday = new Date('2012-12-19T00:00:00-00:00');
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(yesterday, {style: DateStyle.Humanize});
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.yesterday',
            {pseudotranslate: false, replacements: {time: '11:00 a.m.'}},
            defaultTranslations,
            i18n.locale,
          );
        });

        it('formats a date less than one week ago', () => {
          const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000;
          const today = new Date('2012-12-20T00:00:00-00:00');
          const lessThanOneWeekAgo = new Date(
            today.getTime() - fiveDaysInMilliseconds,
          );
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(lessThanOneWeekAgo, {
            style: DateStyle.Humanize,
          });
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.lessThanOneWeekAgo',
            {
              pseudotranslate: false,
              replacements: {weekday: 'Saturday', time: '11:00 a.m.'},
            },
            defaultTranslations,
            i18n.locale,
          );
        });

        it('formats a date less than one year ago', () => {
          // Offset from 2012-12-20 to 2012-07-20
          const fiveMonthsInMilliseconds =
            (30 + 31 + 30 + 31 + 31) * 24 * 60 * 60 * 1000;

          const today = new Date('2012-12-20T00:00:00-00:00');
          const lessThanOneYearAgo = new Date(
            today.getTime() - fiveMonthsInMilliseconds,
          );
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(lessThanOneYearAgo, {
            style: DateStyle.Humanize,
          });
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.lessThanOneYearAgo',
            {
              pseudotranslate: false,
              replacements: {date: 'Jul. 20', time: '10:00 a.m.'},
            },
            defaultTranslations,
            i18n.locale,
          );
        });
      });

      describe('future dates', () => {
        it('formats a date for tomorrow', () => {
          const today = new Date('2012-12-20T00:00:00-00:00');
          const tomorrow = new Date('2012-12-21T00:00:00-00:00');
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(tomorrow, {style: DateStyle.Humanize});
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.tomorrow',
            {pseudotranslate: false, replacements: {time: '11:00 a.m.'}},
            defaultTranslations,
            i18n.locale,
          );
        });

        it('formats a date for today', () => {
          const today = new Date('2012-12-20T00:00:00-00:00');
          const todayInTheFuture = new Date(today.getTime());
          const hoursInTheFuture = 5;
          todayInTheFuture.setHours(today.getHours() + hoursInTheFuture);
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          i18n.formatDate(todayInTheFuture, {style: DateStyle.Humanize});
          expect(translate).toHaveBeenCalledWith(
            'date.humanize.today',
            {pseudotranslate: false, replacements: {time: '4:00 p.m.'}},
            defaultTranslations,
            i18n.locale,
          );
        });

        it('formats a future date', () => {
          const today = new Date('2012-12-20T00:00:00-00:00');
          const futureDate = new Date(today.getTime());
          futureDate.setFullYear(today.getFullYear() + 1);
          clock.mock(today);
          const i18n = new I18n(defaultTranslations, {
            ...defaultDetails,
            timezone,
          });

          expect(i18n.formatDate(futureDate, {style: DateStyle.Humanize})).toBe(
            'Dec. 20, 2013',
          );
        });
      });
    });

    it('formats a date using DateStyle.Time', () => {
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone,
      });

      expect(i18n.formatDate(date, {style: DateStyle.Time})).toBe('11:00 a.m.');
    });

    it('updates format on multiple calls', () => {
      const defaultTimezone = 'America/Toronto';
      const date = new Date('2012-12-20T00:00:00-00:00');
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        timezone: defaultTimezone,
      });

      const expected = new Intl.DateTimeFormat(defaultDetails.locale, {
        timeZone: defaultTimezone,
      }).format(date);

      expect(
        i18n.formatDate(date, {
          timeZone: defaultTimezone,
        }),
      ).toBe(expected);

      const newTimezone = 'Asia/Shanghai';
      const expectedWithNewTimezone = new Intl.DateTimeFormat(
        defaultDetails.locale,
        {
          timeZone: newTimezone,
        },
      ).format(date);

      expect(
        i18n.formatDate(date, {
          timeZone: newTimezone,
        }),
      ).toBe(expectedWithNewTimezone);
    });
  });

  describe('#weekStartDay()', () => {
    it('uses the defaultCountry to get the week start day', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en', country: 'FR'});

      expect(i18n.weekStartDay()).toBe(Weekday.Monday);
    });

    it('uses the country passed in the params instead of the defaultCountry', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en', country: 'FR'});

      expect(i18n.weekStartDay('CA')).toBe(Weekday.Sunday);
    });

    it('fallsback to Sunday if country is not in the list', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en', country: 'XX'});

      expect(i18n.weekStartDay()).toBe(Weekday.Sunday);
    });

    it('throws an error if no country code is passed', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(() => i18n.weekStartDay()).toThrow(
        'No country code provided. weekStartDay() cannot be called without a country code.',
      );
    });
  });

  describe('#getShortCurrencySymbol()', () => {
    it.each`
      currency | locale     | symbol    | prefixed | shortSymbol
      ${'CZK'} | ${'cs-CZ'} | ${' Kč'}  | ${false} | ${' Kč'}
      ${'USD'} | ${'en-CA'} | ${'US$'}  | ${true}  | ${'$'}
      ${'USD'} | ${'en-US'} | ${'$'}    | ${true}  | ${'$'}
      ${'USD'} | ${'fr-FR'} | ${' $US'} | ${false} | ${' $'}
      ${'OMR'} | ${'en-US'} | ${'OMR '} | ${true}  | ${'OMR '}
    `(
      'returns $shortSymbol for $currency in $locale',
      ({currency, locale, symbol, prefixed, shortSymbol}) => {
        const mockResult = {symbol, prefixed};
        getCurrencySymbol.mockReturnValue(mockResult);
        const i18n = new I18n(defaultTranslations, {locale});
        expect(i18n.getShortCurrencySymbol(currency)).toStrictEqual({
          prefixed,
          symbol: shortSymbol,
        });
      },
    );
  });

  describe('#getCurrencySymbol()', () => {
    it('returns the locale-specific currency symbol and its position', () => {
      const mockResult = {
        symbol: '€',
        prefixed: true,
      };
      getCurrencySymbol.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.getCurrencySymbol('eur')).toStrictEqual(mockResult);
    });
  });

  describe('#formatName()', () => {
    it('returns only the firstName when lastName is missing', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('first')).toStrictEqual('first');
      expect(i18n.formatName('first', '')).toStrictEqual('first');
    });

    it('returns only the lastName when firstName is missing', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('', 'last')).toStrictEqual('last');
    });

    it('defaults to firstName for unknown locale', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'unknown'});

      expect(i18n.formatName('first', 'last')).toStrictEqual('first');
    });

    it('uses fallback locale value for locale without custom formatter', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'fr-CA'});

      expect(i18n.formatName('first', 'last')).toStrictEqual('first');
    });

    it('returns firstName for English', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('first', 'last')).toStrictEqual('first');
    });

    it('returns custom name for Japanese', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'ja'});

      expect(i18n.formatName('first', 'last')).toStrictEqual('last様');
    });

    it('returns lastName only, for zh-CN', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'zh-CN'});

      expect(i18n.formatName('first', 'last')).toStrictEqual('last');
    });

    it('returns lastName only, for zh-TW', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'zh-TW'});

      expect(i18n.formatName('first', 'last')).toStrictEqual('last');
    });

    it('returns only the firstName when lastName is missing using full', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('first', '', {full: true})).toStrictEqual('first');
      expect(i18n.formatName('first', undefined, {full: true})).toStrictEqual(
        'first',
      );
    });

    it('returns only the lastName when firstName is missing using full', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('', 'last', {full: true})).toStrictEqual('last');
    });

    it('returns a string when lastName is undefined using full', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('', undefined, {full: true})).toStrictEqual('');
    });

    it('returns a string when first and lastName are missing using full', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName(undefined, undefined, {full: true})).toStrictEqual(
        '',
      );
    });

    it('defaults to firstName lastName for unknown locale', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'unknown'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'first last',
      );
    });

    it('uses fallback locale value for locale without custom formatter using full', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'fr-CA'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'first last',
      );
    });

    it('returns firstName first for English', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'first last',
      );
    });

    it('returns lastName first and no space for Japanese', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'ja'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'lastfirst',
      );
    });

    it('returns lastName first and no space for Korean', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'ko'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'lastfirst',
      );
    });

    it('returns lastName first and no space for zh-CN', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'zh-CN'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'lastfirst',
      );
    });

    it('returns lastName first and no space for zh-TW', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'zh-TW'});

      expect(i18n.formatName('first', 'last', {full: true})).toStrictEqual(
        'lastfirst',
      );
    });
  });

  describe('#translationKeyExists', () => {
    it('returns true if the translation key exists', () => {
      const mockResult = {hello: 'translated string'};
      getTranslationTree.mockReturnValue(mockResult);

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.translationKeyExists('hello');

      expect(result).toBe(true);
    });

    it('returns false if the translation key does not exist', () => {
      const key = 'foo';
      const error = new MissingTranslationError(key, defaultDetails.locale);
      getTranslationTree.mockImplementation(() => {
        throw error;
      });

      const i18n = new I18n(defaultTranslations, defaultDetails);
      const result = i18n.translationKeyExists(key);

      expect(result).toBe(false);
    });

    it('returns false if the translation key does not exist and onError is overridden', () => {
      const key = 'foo';
      const error = new MissingTranslationError(key, defaultDetails.locale);
      getTranslationTree.mockImplementation(() => {
        throw error;
      });
      const i18n = new I18n(defaultTranslations, {
        ...defaultDetails,
        onError: jest.fn(),
      });

      const result = i18n.translationKeyExists(key);
      expect(result).toBe(false);
    });
  });

  describe('#hasEasternNameOrderFormatter', () => {
    it('returns true if easternNameOrderFormatter exists', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'ja'});

      expect(i18n.hasEasternNameOrderFormatter()).toStrictEqual(true);
    });

    it('returns false if custom name formatter does not exist', () => {
      const i18n = new I18n(defaultTranslations, {locale: 'en'});

      expect(i18n.hasEasternNameOrderFormatter()).toStrictEqual(false);
    });
  });
});
