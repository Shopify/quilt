import {I18n} from '../i18n';
import {MissingTranslationError} from '../errors';

jest.mock('../utilities', () => ({
  ...jest.requireActual('../utilities'),
  translate: jest.fn(),
  getTranslationTree: jest.fn(),
  getCurrencySymbol: jest.fn(
    jest.requireActual('../utilities').getCurrencySymbol,
  ),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const translate: jest.Mock = require('../utilities').translate;

describe('I18n', () => {
  const defaultDetails = {locale: 'en-ca'};
  const defaultTranslations = [{hello: 'Hello, {name}!'}];

  beforeEach(() => {
    translate.mockReset();
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

  describe('#translate()', () => {
    it('calls the translate() utility', () => {
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
});
