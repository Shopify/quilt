import {I18nFormatter} from '../i18nFormatter';
import {LanguageDirection} from '../utilities/types';
import {DateStyle, Weekday} from '../constants';
import {MissingTranslationError} from '../utilities/errors';
import {convertFirstSpaceToNonBreakingSpace} from '../utilities';

jest.mock('../utilities', () => ({
  ...jest.requireActual('../utilities'),
  translate: jest.fn(),
  getTranslationTree: jest.fn(),
  getCurrencySymbol: jest.fn(
    jest.requireActual('../utilities').getCurrencySymbol,
  ),
}));

const originalGetCurrencySymbol: jest.Mock =
  jest.requireActual('../utilities').getCurrencySymbol;

/* eslint-disable @typescript-eslint/no-var-requires */
const translate: jest.Mock = require('../utilities').translate;
const getCurrencySymbolMock: jest.Mock =
  require('../utilities').getCurrencySymbol;
/* eslint-enable @typescript-eslint/no-var-requires */

describe('I18nFormatter', () => {
  const defaultLocale = {locale: 'en-ca'};
  const defaultTranslations = [{hello: 'Hello, {name}!'}];

  describe('#languageDirection', () => {
    it('is LanguageDirection.Ltr for LTR languages', () => {
      expect(
        new I18nFormatter({locale: 'en'}, defaultTranslations),
      ).toHaveProperty('languageDirection', LanguageDirection.Ltr);
    });

    it('is LanguageDirection.Rtl for RTL languages', () => {
      expect(
        new I18nFormatter({locale: 'ar'}, defaultTranslations),
      ).toHaveProperty('languageDirection', LanguageDirection.Rtl);
    });
  });

  describe('#isLtrLanguage', () => {
    it('is true for LTR languages', () => {
      expect(
        new I18nFormatter({locale: 'en'}, defaultTranslations),
      ).toHaveProperty('isLtrLanguage', true);
    });

    it('is false for RTL languages', () => {
      expect(
        new I18nFormatter({locale: 'ar'}, defaultTranslations),
      ).toHaveProperty('isLtrLanguage', false);
    });
  });

  describe('#isRtlLanguage', () => {
    it('is false for LTR languages', () => {
      expect(
        new I18nFormatter({locale: 'en'}, defaultTranslations),
      ).toHaveProperty('isRtlLanguage', false);
    });

    it('is true for RTL languages', () => {
      expect(
        new I18nFormatter({locale: 'ar'}, defaultTranslations),
      ).toHaveProperty('isRtlLanguage', true);
    });
  });

  describe('#region', () => {
    it('is determined from the locale', () => {
      const locale = {locale: 'fr-ca'};
      const i18n = new I18nFormatter(locale, defaultTranslations);
      expect(i18n).toHaveProperty('region', 'CA');
    });

    it('is undefined when the locale does not have a country code', () => {
      const locale = {locale: 'fr'};
      const i18n = new I18nFormatter(locale, defaultTranslations);
      expect(i18n).toHaveProperty('region', undefined);
    });
  });

  describe('#defaultCurrency', () => {
    it('is exposed publicly', () => {
      const defaultCurrency = 'CAD';
      const i18n = new I18nFormatter(
        {...defaultLocale, currency: defaultCurrency},
        defaultTranslations,
      );
      expect(i18n).toHaveProperty('defaultCurrency', defaultCurrency);
    });
  });

  describe('#defaultTimezone', () => {
    it('is exposed publicly', () => {
      const defaultTimezone = 'EST';
      const i18n = new I18nFormatter(
        {
          ...defaultLocale,
          timezone: defaultTimezone,
        },
        defaultTranslations,
      );
      expect(i18n).toHaveProperty('defaultTimezone', defaultTimezone);
    });
  });
});
