import {SimpleI18n} from '../simpleI18n';
import {MissingTranslationError} from '../utilities/errors';

jest.mock('../utilities', () => ({
  ...jest.requireActual('../utilities'),
  translate: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const translate: jest.Mock = require('../utilities').translate;

describe('I18n', () => {
  const defaultLocale = 'en-ca';
  const defaultTranslations = [{hello: 'Hello, {name}!'}];

  beforeEach(() => {
    translate.mockReset();
  });

  describe('#locale', () => {
    it('is exposed publicly', () => {
      const locale = 'fr-ca';
      const i18n = new SimpleI18n(defaultTranslations, locale);
      expect(i18n).toHaveProperty('locale', locale);
    });
  });

  describe('#language', () => {
    it('is determined from the locale', () => {
      const locale = 'fr-ca';
      const i18n = new SimpleI18n(defaultTranslations, locale);
      expect(i18n).toHaveProperty('language', 'fr');
    });
  });

  describe('#region', () => {
    it('is determined from the locale', () => {
      const locale = 'fr-ca';
      const i18n = new SimpleI18n(defaultTranslations, locale);
      expect(i18n).toHaveProperty('region', 'CA');
    });

    it('is undefined when the locale does not have a country code', () => {
      const locale = 'fr';
      const i18n = new SimpleI18n(defaultTranslations, locale);
      expect(i18n).toHaveProperty('region', undefined);
    });
  });

  describe('#translate()', () => {
    it('calls the translate() utility', () => {
      const mockResult = 'translated string';
      const replacements = {name: 'Chris'};
      translate.mockReturnValue(mockResult);

      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      const result = i18n.translate('hello', replacements);

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        defaultTranslations,
        i18n.locale,
        replacements,
      );
    });

    it('calls the translate() utility when no replacements or scope are provided', () => {
      const mockResult = 'translated string';
      translate.mockReturnValue(mockResult);

      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      const result = i18n.translate('hello');

      expect(result).toBe(mockResult);
      expect(translate).toHaveBeenCalledWith(
        'hello',
        defaultTranslations,
        i18n.locale,
        {},
      );
    });

    it('rethrows a missing translation error by default', () => {
      const key = 'hello';
      const error = new MissingTranslationError(key, defaultLocale);
      translate.mockImplementation(() => {
        throw error;
      });

      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      expect(() => i18n.translate(key)).toThrow(error);
    });

    it('rethrows a missing translation error with the missing key message', () => {
      const key = 'hello';
      const error = new MissingTranslationError(key, defaultLocale);
      translate.mockImplementation(() => {
        throw error;
      });

      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      expect(() => i18n.translate(key)).toThrow(
        `Missing translation for key: ${key}`,
      );
    });
  });

  describe('#translationKeyExists', () => {
    it('returns true if the translation key exists', () => {
      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      const result = i18n.translationKeyExists('hello');

      expect(result).toBe(true);
    });

    it('returns false if the translation key does not exist', () => {
      const key = 'foo';
      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      const result = i18n.translationKeyExists(key);

      expect(result).toBe(false);
    });
  });
});
