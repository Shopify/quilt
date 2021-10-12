import React from 'react';

import {
  translate,
  getTranslationTree,
  PSEUDOTRANSLATE_OPTIONS,
  getCurrencySymbol,
  memoizedNumberFormatter,
  memoizedPluralRules,
} from '../utilities';

const {pseudotranslate} = jest.requireMock('@shopify/i18n') as {
  pseudotranslate: jest.Mock;
};

const locale = 'en-us';

jest.mock('@shopify/i18n', () => ({
  pseudotranslate: jest.fn(),
}));

describe('getTranslationTree()', () => {
  it('returns the translation keys if it has nested values', () => {
    expect(
      getTranslationTree('foo', {foo: {bar: 'one'}}, locale),
    ).toMatchObject({
      bar: 'one',
    });
  });

  it('returns the translation keys with replacements if it has nested values', () => {
    expect(
      getTranslationTree('foo', {foo: {bar: '{replacement}'}}, locale, {
        replacement: 'bar',
      }),
    ).toMatchObject({
      bar: 'bar',
    });
  });

  it('returns the singular translation keys if it has nested values', () => {
    expect(
      getTranslationTree(
        'foo',
        {foo: {bar: {one: 'one', other: 'other'}}},
        locale,
        {
          count: 1,
        },
      ),
    ).toMatchObject({
      bar: 'one',
    });
  });

  it('returns the pluralized translation keys if it has nested values', () => {
    expect(
      getTranslationTree(
        'foo',
        {foo: {bar: {one: 'one', other: 'other'}}},
        locale,
        {
          count: 2,
        },
      ),
    ).toMatchObject({
      bar: 'other',
    });
  });

  it('returns the leaf string', () => {
    expect(getTranslationTree('foo.bar', {foo: {bar: 'one'}}, locale)).toBe(
      'one',
    );
  });

  it('returns the leaf string with replacements', () => {
    expect(
      getTranslationTree('foo.bar', {foo: {bar: '{replacement}'}}, locale, {
        replacement: 'bar',
      }),
    ).toBe('bar');
  });

  it('returns the singular leaf string', () => {
    expect(
      getTranslationTree(
        'foo.bar',
        {foo: {bar: {one: 'one', other: 'other'}}},
        locale,
        {
          count: 1,
        },
      ),
    ).toBe('one');
  });

  it('returns the pluralized leaf string', () => {
    expect(
      getTranslationTree(
        'foo.bar',
        {foo: {bar: {one: 'one', other: 'other'}}},
        locale,
        {
          count: 2,
        },
      ),
    ).toBe('other');
  });

  it('returns the translation keys even if they are hidden in a second dictionary', () => {
    expect(
      getTranslationTree(
        'foobar.barfoo',
        [{foo: {bar: 'one'}}, {foobar: {barfoo: 'two'}}],
        locale,
      ),
    ).toBe('two');
  });

  it('throws a MissingTranslationError when no translation is found', () => {
    expect(() =>
      getTranslationTree('foo.bar.baz', {foo: {bar: 'one'}}, locale),
    ).toThrow('Missing translation for key: foo.bar.baz in locale: en-us');
  });
});

describe('memoizedNumberFormatter', () => {
  it('returns the same object when passed the same arguments', () => {
    const numberFormatterA = memoizedNumberFormatter(locale);
    expect(numberFormatterA).toBeInstanceOf(Intl.NumberFormat);

    const numberFormatterB = memoizedNumberFormatter(locale);
    expect(numberFormatterB).toBeInstanceOf(Intl.NumberFormat);
    expect(numberFormatterB).toBe(numberFormatterA);
  });

  it('returns the same object when passed multiple locales as an array', () => {
    const locales = ['en-US', 'en-CA'];
    const numberFormatterA = memoizedNumberFormatter(locales);
    expect(numberFormatterA).toBeInstanceOf(Intl.NumberFormat);

    const numberFormatterB = memoizedNumberFormatter(locales);
    expect(numberFormatterB).toBeInstanceOf(Intl.NumberFormat);
    expect(numberFormatterB).toBe(numberFormatterA);
  });

  it('returns different object when passed different arguments', () => {
    const numberFormatterA = memoizedNumberFormatter(locale);
    expect(numberFormatterA).toBeInstanceOf(Intl.NumberFormat);

    const numberFormatterB = memoizedNumberFormatter(locale, {
      style: 'decimal',
    });
    expect(numberFormatterB).toBeInstanceOf(Intl.NumberFormat);
    expect(numberFormatterB).not.toBe(numberFormatterA);
    expect(numberFormatterB.resolvedOptions()).toMatchObject({
      style: 'decimal',
    });
  });

  it('passes options to Intl.NumberFormat constructor', () => {
    const numberFormatter = memoizedNumberFormatter(locale, {
      style: 'decimal',
    });
    expect(numberFormatter).toBeInstanceOf(Intl.NumberFormat);
    expect(numberFormatter.resolvedOptions()).toMatchObject({style: 'decimal'});
  });
});

describe('memoizedPluralRules', () => {
  it('returns the same object when passed the same arguments', () => {
    const pluralRulesA = memoizedPluralRules(locale);
    expect(pluralRulesA).toBeInstanceOf(Intl.PluralRules);

    const pluralRulesB = memoizedPluralRules(locale);
    expect(pluralRulesB).toBeInstanceOf(Intl.PluralRules);
    expect(pluralRulesB).toBe(pluralRulesA);
  });

  it('returns different object when passed different arguments', () => {
    const pluralRulesA = memoizedPluralRules(locale);
    expect(pluralRulesA).toBeInstanceOf(Intl.PluralRules);

    const pluralRulesB = memoizedPluralRules(locale, {
      type: 'ordinal',
    });
    expect(pluralRulesB).toBeInstanceOf(Intl.PluralRules);
    expect(pluralRulesB).not.toBe(pluralRulesA);
  });

  it('passes options to Intl.PluralRules constructor', () => {
    const pluralRules = memoizedPluralRules(locale, {
      type: 'ordinal',
    });
    expect(pluralRules).toBeInstanceOf(Intl.PluralRules);
    expect(pluralRules.resolvedOptions()).toMatchObject({type: 'ordinal'});
  });
});

describe('translate()', () => {
  beforeEach(() => {
    pseudotranslate.mockReset();
    pseudotranslate.mockImplementation((text: string) => text);
  });

  it('throws a MissingTranslationError when no translation is found', () => {
    expect(() => translate('foo', {}, {}, locale)).toThrow(
      'Missing translation for key: foo in locale: en-us',
    );
  });

  it('throws a MissingTranslationError with the normalizedId when no translation is found using a scope', () => {
    const scope = 'bar';
    const id = 'foo';
    expect(() => translate(id, {scope}, {}, locale)).toThrow(`${scope}.${id}`);
  });

  it('looks up a translation by key', () => {
    expect(translate('foo', {}, {foo: 'bar'}, locale)).toBe('bar');
  });

  it('looks up a translation by nested key', () => {
    expect(translate('foo.bar', {}, {foo: {bar: 'baz'}}, locale)).toBe('baz');
  });

  describe('scope', () => {
    it('looks up a translation with a simple scope', () => {
      expect(
        translate('bar', {scope: 'foo'}, {foo: {bar: 'baz'}}, locale),
      ).toBe('baz');
    });

    it('looks up a translation with an array scope', () => {
      expect(
        translate(
          'baz',
          {scope: ['foo', 'bar']},
          {foo: {bar: {baz: 'qux'}}},
          locale,
        ),
      ).toBe('qux');
    });

    it('looks up a translation with a keypath scope', () => {
      expect(
        translate(
          'baz',
          {scope: 'foo.bar'},
          {foo: {bar: {baz: 'qux'}}},
          locale,
        ),
      ).toBe('qux');
    });

    it('looks up a translation with a scope and keypath', () => {
      expect(
        translate(
          'bar.baz',
          {scope: ['foo']},
          {foo: {bar: {baz: 'qux'}}},
          locale,
        ),
      ).toBe('qux');
    });
  });

  it('looks through an array of translation dictionaries', () => {
    const dictionaries: any[] = [{foo: {baz: 'one'}}, {foo: {bar: 'two'}}];
    expect(translate('foo.bar', {}, dictionaries, locale)).toBe('two');
  });

  it('uses the first dictionary in order that has a translation', () => {
    const dictionaries: any[] = [{foo: {bar: 'one'}}, {foo: {bar: 'two'}}];
    expect(translate('foo.bar', {}, dictionaries, locale)).toBe('one');
  });

  describe('replacements', () => {
    it('performs replacements with strings', () => {
      expect(
        translate(
          'foo',
          {replacements: {bar: 'true'}},
          {foo: 'bar: {bar}'},
          locale,
        ),
      ).toBe('bar: true');
    });

    it('performs replacements with JSX by creating an array and cloning elements with unique keys', () => {
      function CustomComponent() {
        return null;
      }

      const bar = <div>Content</div>;
      const baz = <CustomComponent />;
      const translated = translate(
        'foo',
        {
          replacements: {
            bar,
            baz,
          },
        },
        {foo: '{bar} {baz} '},
        locale,
      );

      expect(translated).toBeInstanceOf(Array);
      expect(translated).toHaveLength(4);
      expect(translated).toMatchObject([
        React.cloneElement(bar, {key: 1}),
        ' ',
        React.cloneElement(baz, {key: 2}),
        ' ',
      ]);
    });

    describe('when a replacement named `count` is passed', () => {
      it('uses the pluralization rules of the provided locale', () => {
        const dictionary = {foo: {one: '{count} foo', other: '{count} foos'}};
        expect(
          translate('foo', {replacements: {count: 1}}, dictionary, locale),
        ).toBe('1 foo');
        expect(
          translate('foo', {replacements: {count: 2}}, dictionary, locale),
        ).toBe('2 foos');
      });

      it('handles a count of zero', () => {
        const dictionary = {
          foo: {
            zero: 'no foo',
            one: '{count} foo',
            other: '{count} foos',
          },
        };

        expect(
          translate('foo', {replacements: {count: 0}}, dictionary, locale),
        ).toBe('0 foos');
        expect(
          translate('foo', {replacements: {count: 0}}, dictionary, 'cy'),
        ).toBe('no foo');
      });

      it('formats the replacement `count`', () => {
        const dictionary = {foo: {one: '{count} foo', other: '{count} foos'}};
        expect(
          translate('foo', {replacements: {count: 1000}}, dictionary, locale),
        ).toBe('1,000 foos');
      });
    });

    it('throws a MissingReplacementError when there is a missing replacement and no replacements', () => {
      expect(() => translate('foo', {}, {foo: 'bar: {bar}'}, locale)).toThrow(
        "No replacement found for key 'bar' (and no replacements were passed in).",
      );
    });

    it('throws a MissingReplacementError when there is a missing replacement', () => {
      expect(() =>
        translate(
          'foo',
          {
            replacements: {
              key1: 'replacements text 1',
              key2: 123,
            },
          },
          {foo: 'bar: {bar}'},
          locale,
        ),
      ).toThrow(
        "No replacement found for key 'bar'. The following replacements were passed: 'key1', 'key2'",
      );
    });
  });

  describe('pseudotranslate', () => {
    it('does not call the pseudotranslate function when not set', () => {
      translate('foo', {pseudotranslate: false}, {foo: 'bar'}, locale);
      expect(pseudotranslate).not.toHaveBeenCalled();
    });

    it('calls the pseudotranslate function when set', () => {
      translate('foo', {pseudotranslate: true}, {foo: 'bar'}, locale);
      expect(pseudotranslate).toHaveBeenCalledWith(
        'bar',
        PSEUDOTRANSLATE_OPTIONS,
      );
    });

    it('calls the pseudotranslate with toLocale when pseudotranslate is a string', () => {
      translate('foo', {pseudotranslate: 'de'}, {foo: 'bar'}, locale);
      expect(pseudotranslate).toHaveBeenCalledWith('bar', {
        ...PSEUDOTRANSLATE_OPTIONS,
        toLocale: 'de',
      });
    });
  });

  describe('getCurrencySymbol', () => {
    it('returns the locale-specific currency symbol and its position', () => {
      expect(getCurrencySymbol('en', {currency: 'eur'})).toStrictEqual({
        symbol: '€',
        prefixed: true,
      });
    });
  });
});
