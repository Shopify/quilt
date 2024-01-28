import {INTERPOLATE_FORMAT, SimpleI18n} from '../simpleI18n';

jest.mock('../simpleI18nUtils', () => ({
  ...jest.requireActual('../simpleI18nUtils'),
  translate: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const translate: jest.Mock = require('../simpleI18nUtils').translate;

describe('INTERPOLATE_FORMAT', () => {
  it.each([
    // Matches
    ['{foo}', ['foo']],
    ['{f}', ['f']],
    ['{{foo}}', ['foo']],
    ['test {foo }', ['foo']],
    ['{ foo} test', ['foo']],
    ['test {     foo   } test', ['foo']],
    ['test {foo} test {bar}', ['foo', 'bar']],
    // No matches
    ['{}', []],
    ['{     }', []],
    ['{ test {}', []],
  ])('matches "%s" with keys %p', (input, keys) => {
    expect.assertions(keys.length);
    Array.from(input.matchAll(INTERPOLATE_FORMAT)).forEach(
      ([_, key], matchIndex) => {
        expect(key).toBe(keys[matchIndex]);
      },
    );
  });
});

describe('SimpleI18n', () => {
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
    const id = 'test';
    const translations = [
      {
        [id]: 'foo { bar } baz',
        pluralizations: {
          '0': 'I have no car!', // eslint-disable-line @typescript-eslint/naming-convention
          '1': 'I have a single car!', // eslint-disable-line @typescript-eslint/naming-convention
          one: 'I have {count} car!',
          other: 'I have {count} cars!',
          ordinal: {
            one: 'This is my {ordinal}st car!',
            two: 'This is my {ordinal}nd car!',
            few: 'This is my {ordinal}rd car!',
            other: 'This is my {ordinal}th car!',
          },
        },
      },
    ];

    const simpleI18n = new SimpleI18n(translations, defaultLocale);

    it('returns selects the proper values for cardinal pluralization', () => {
      const translationNone = simpleI18n.translate('pluralizations', {
        count: 0,
      });

      expect(translationNone).toBe('I have no car!');

      const translationOne = simpleI18n.translate('pluralizations', {count: 1});
      expect(translationOne).toBe('I have a single car!');

      const translationOther = simpleI18n.translate('pluralizations', {
        count: 2,
      });
      expect(translationOther).toBe('I have 2 cars!');
    });

    it('returns selects the proper values for ordinal pluralization', () => {
      const translationFirst = simpleI18n.translate('pluralizations', {
        ordinal: 1,
      });
      const translationSecond = simpleI18n.translate('pluralizations', {
        ordinal: 2,
      });
      const translationThird = simpleI18n.translate('pluralizations', {
        ordinal: 3,
      });
      const translationFourth = simpleI18n.translate('pluralizations', {
        ordinal: 4,
      });
      expect(translationFirst).toBe('This is my 1st car!');
      expect(translationSecond).toBe('This is my 2nd car!');
      expect(translationThird).toBe('This is my 3rd car!');
      expect(translationFourth).toBe('This is my 4th car!');
    });

    it.each([2, 'bar'])(
      'returns a string when a simple replacement is used',
      (replacementValue) => {
        const replacements = {bar: replacementValue};
        const translation = simpleI18n.translate(id, replacements);

        expect(translation).toBe(`foo ${replacementValue} baz`);
      },
    );

    it('will return translation from any dictionary it is initialized with in array order', () => {
      const translations = {
        foo: 'a foo',
      };
      const fallbackTranslations = {
        foo: 'a different foo',
        bar: 'a bar',
      };
      const i18n = new SimpleI18n(
        [translations, fallbackTranslations],
        defaultLocale,
      );
      expect(i18n.translate('foo')).toBe('a foo');
      expect(i18n.translate('bar')).toBe('a bar');
    });

    it('throws a missing translation error by default', () => {
      const key = 'badkey';
      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      expect(() => i18n.translate(key)).toThrow('Missing translation for key');
    });

    it('throws a missing replacement error if an expected replacment is not found', () => {
      const i18n = new SimpleI18n(translations, defaultLocale);
      expect(() => i18n.translate(id)).toThrow('No replacement found for key');
    });
  });

  describe('#translationKeyExists', () => {
    it('returns true if the translation key exists', () => {
      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      const result = i18n.translationKeyExists('hello');

      expect(result).toBe(true);
    });

    it('is able to check for nested keys', () => {
      const nestedTranslations = [
        {
          foo: {
            bar: {
              baz: 'baz',
            },
          },
        },
      ];
      const i18n = new SimpleI18n(nestedTranslations, defaultLocale);
      expect(i18n.translationKeyExists('foo.bar.baz')).toBe(true);
    });

    it('returns false if the translation key does not exist', () => {
      const key = 'foo';
      const i18n = new SimpleI18n(defaultTranslations, defaultLocale);
      const result = i18n.translationKeyExists(key);

      expect(result).toBe(false);
    });
  });
});
