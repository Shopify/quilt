import React from 'react';

import {
  memoizedNumberFormatter,
  memoizedStringNumberFormatter,
  numberFormatCacheKey,
  translate,
} from '../translate';

describe('memoizedNumberFormatter()', () => {
  it.each`
    locale                             | expectedValue | expectedLocale
    ${'en-US'}                         | ${'1.23'}     | ${'en-US-u-nu-latn'}
    ${'fr-CA'}                         | ${'1,23'}     | ${'fr-CA-u-nu-latn'}
    ${'zh-Hans-hk'}                    | ${'1.23'}     | ${'zh-Hans-HK-u-nu-latn'}
    ${'ar-EG'}                         | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'ar-EG-u-nu-arab'}               | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'fa-IR'}                         | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
  `(
    'returns formatted number according to the locale provided with the latin numbering system',
    ({locale, expectedValue, expectedLocale}) => {
      const amount = 1.23;
      const numberFormatter = memoizedNumberFormatter(locale, {
        style: 'decimal',
      });
      expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
      expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
        expectedValue,
      );
    },
  );

  it.each`
    locale                             | expectedValue     | expectedLocale
    ${'en-US'}                         | ${'$1.23'}        | ${'en-US-u-nu-latn'}
    ${'fr-CA'}                         | ${'1,23 $ US'}    | ${'fr-CA-u-nu-latn'}
    ${'zh-Hans-hk'}                    | ${'US$1.23'}      | ${'zh-Hans-HK-u-nu-latn'}
    ${'ar-EG'}                         | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'ar-EG-u-nu-arab'}               | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'fa-IR'}                         | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
  `(
    'returns formatted currency according to the locale provided with the latin numbering system',
    ({locale, expectedValue, expectedLocale}) => {
      const amount = 1.23;
      const numberFormatter = memoizedNumberFormatter(locale, {
        style: 'currency',
        currency: 'USD',
      });
      expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
      expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
        expectedValue,
      );
    },
  );

  describe('when Intl.Locale throws an error', () => {
    beforeEach(() => {
      jest.spyOn(Intl, 'Locale').mockImplementation(() => {
        throw new Error();
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each`
      locale                             | expectedValue | expectedLocale
      ${'en-US'}                         | ${'1.23'}     | ${'en-US-u-nu-latn'}
      ${'fr-CA'}                         | ${'1,23'}     | ${'fr-CA-u-nu-latn'}
      ${'zh-Hans-hk'}                    | ${'1.23'}     | ${'zh-Hans-HK-u-nu-latn'}
      ${'ar-EG'}                         | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'ar-EG-u-nu-arab'}               | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'fa-IR'}                         | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
    `(
      'returns formatted number according to the locale provided, falling back to appending the latin numbering system',
      ({locale, expectedValue, expectedLocale}) => {
        const amount = 1.23;
        const numberFormatter = memoizedNumberFormatter(locale, {
          style: 'decimal',
        });
        expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
        expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
          expectedValue,
        );
      },
    );

    it.each`
      locale                             | expectedValue     | expectedLocale
      ${'en-US'}                         | ${'$1.23'}        | ${'en-US-u-nu-latn'}
      ${'fr-CA'}                         | ${'1,23 $ US'}    | ${'fr-CA-u-nu-latn'}
      ${'zh-Hans-hk'}                    | ${'US$1.23'}      | ${'zh-Hans-HK-u-nu-latn'}
      ${'ar-EG'}                         | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'ar-EG-u-nu-arab'}               | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'fa-IR'}                         | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
    `(
      'returns formatted currency according to the locale provided, falling back to appending the latin numbering system',
      ({locale, expectedValue, expectedLocale}) => {
        const amount = 1.23;
        const numberFormatter = memoizedNumberFormatter(locale, {
          style: 'currency',
          currency: 'USD',
        });
        expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
        expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
          expectedValue,
        );
      },
    );
  });
});

describe('memoizedStringNumberFormatter()', () => {
  it.each`
    locale                             | expectedValue | expectedLocale
    ${'en-US'}                         | ${'1.23'}     | ${'en-US-u-nu-latn'}
    ${'fr-CA'}                         | ${'1,23'}     | ${'fr-CA-u-nu-latn'}
    ${'zh-Hans-hk'}                    | ${'1.23'}     | ${'zh-Hans-HK-u-nu-latn'}
    ${'ar-EG'}                         | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'ar-EG-u-nu-arab'}               | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'fa-IR'}                         | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
  `(
    'returns formatted number according to the locale provided with the latin numbering system',
    ({locale, expectedValue, expectedLocale}) => {
      const amount = '1.23';
      const numberFormatter = memoizedStringNumberFormatter(locale, {
        style: 'decimal',
      });
      expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
      expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
        expectedValue,
      );
    },
  );

  it.each`
    locale                             | expectedValue     | expectedLocale
    ${'en-US'}                         | ${'$1.23'}        | ${'en-US-u-nu-latn'}
    ${'fr-CA'}                         | ${'1,23 $ US'}    | ${'fr-CA-u-nu-latn'}
    ${'zh-Hans-hk'}                    | ${'US$1.23'}      | ${'zh-Hans-HK-u-nu-latn'}
    ${'ar-EG'}                         | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'ar-EG-u-nu-arab'}               | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
    ${'fa-IR'}                         | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
    ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
  `(
    'returns formatted currency according to the locale provided with the latin numbering system',
    ({locale, expectedValue, expectedLocale}) => {
      const amount = '1.23';
      const numberFormatter = memoizedStringNumberFormatter(locale, {
        style: 'currency',
        currency: 'USD',
      });
      expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
      expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
        expectedValue,
      );
    },
  );

  describe('when Intl.Locale throws an error', () => {
    beforeEach(() => {
      jest.spyOn(Intl, 'Locale').mockImplementation(() => {
        throw new Error();
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each`
      locale                             | expectedValue | expectedLocale
      ${'en-US'}                         | ${'1.23'}     | ${'en-US-u-nu-latn'}
      ${'fr-CA'}                         | ${'1,23'}     | ${'fr-CA-u-nu-latn'}
      ${'zh-Hans-hk'}                    | ${'1.23'}     | ${'zh-Hans-HK-u-nu-latn'}
      ${'ar-EG'}                         | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'ar-EG-u-nu-arab'}               | ${'1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'fa-IR'}                         | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'1.23'}     | ${'fa-IR-u-nu-latn'}
    `(
      'returns formatted number according to the locale provided, falling back to appending the latin numbering system',
      ({locale, expectedValue, expectedLocale}) => {
        const amount = '1.23';
        const numberFormatter = memoizedStringNumberFormatter(locale, {
          style: 'decimal',
        });
        expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
        expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
          expectedValue,
        );
      },
    );

    it.each`
      locale                             | expectedValue     | expectedLocale
      ${'en-US'}                         | ${'$1.23'}        | ${'en-US-u-nu-latn'}
      ${'fr-CA'}                         | ${'1,23 $ US'}    | ${'fr-CA-u-nu-latn'}
      ${'zh-Hans-hk'}                    | ${'US$1.23'}      | ${'zh-Hans-HK-u-nu-latn'}
      ${'ar-EG'}                         | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'ar-EG-u-nu-arab'}               | ${'US$ 1.23'}     | ${'ar-EG-u-nu-latn'}
      ${'fa-IR'}                         | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-u-nu-arabext-x-ab-cdefg'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
      ${'fa-IR-x-ab-cdefg-u-nu-arabext'} | ${'\u200E$ 1.23'} | ${'fa-IR-u-nu-latn'}
    `(
      'returns formatted currency according to the locale provided, falling back to appending the latin numbering system',
      ({locale, expectedValue, expectedLocale}) => {
        const amount = '1.23';
        const numberFormatter = memoizedStringNumberFormatter(locale, {
          style: 'currency',
          currency: 'USD',
        });
        expect(numberFormatter.resolvedOptions().locale).toBe(expectedLocale);
        expect(sanitizeSpaces(numberFormatter.format(amount))).toBe(
          expectedValue,
        );
      },
    );
  });
});

describe('numberFormatCacheKey()', () => {
  const locale = 'en-CA';
  const otherLocale = 'en-US';
  const options = {currency: 'USD'};
  const optionsKey = JSON.stringify(options);

  it('creates a key for an undefined locale with options', () => {
    expect(numberFormatCacheKey(undefined, options)).toBe(
      `undefined-${optionsKey}`,
    );
  });

  it('creates a key for an undefined locale without options', () => {
    expect(numberFormatCacheKey()).toBe(`undefined-{}`);
  });

  it('creates a key for a single locale with options', () => {
    expect(numberFormatCacheKey(locale, options)).toBe(
      `${locale}-${optionsKey}`,
    );
  });

  it('creates a key for a single locale without options', () => {
    expect(numberFormatCacheKey(locale)).toBe(`${locale}-{}`);
  });

  it('creates a key for a multiple locales with options', () => {
    expect(numberFormatCacheKey([locale, otherLocale], options)).toBe(
      `${locale}-${otherLocale}-${optionsKey}`,
    );
  });

  it('creates a key for a multiple locales without options', () => {
    expect(numberFormatCacheKey([locale, otherLocale])).toBe(
      `${locale}-${otherLocale}-{}`,
    );
  });

  it('sorts locales when there are multiple', () => {
    expect(numberFormatCacheKey([otherLocale, locale])).toBe(
      `${locale}-${otherLocale}-{}`,
    );
  });
});

describe('translate()', () => {
  const id = 'test';
  const translations = {
    // Lots of spaces to make sure we're taking the whole match length into account.
    [id]: 'foo {    bar     } baz',
    pluralizations: {
      one: 'I have {count} car!',
      other: 'I have {count} cars!',
      ordinal: {
        one: 'This is my {ordinal}st car!',
        two: 'This is my {ordinal}nd car!',
        few: 'This is my {ordinal}rd car!',
        other: 'This is my {ordinal}th car!',
      },
    },
  };
  const locale = 'en-CA';

  it('returns an array when a React node replacement is used', () => {
    const bar = <span>bar</span>;
    const replacements = {bar};
    const translation = translate('test', {replacements}, translations, locale);

    expect(translation).toMatchObject([
      'foo ',
      React.cloneElement(bar, {key: 1}),
      ' baz',
    ]);
  });

  it('returns selects the proper values for cardinal pluralization', () => {
    const translationOne = translate(
      'pluralizations',
      {replacements: {count: 1}},
      translations,
      locale,
    );
    expect(translationOne).toBe('I have 1 car!');

    const translationOther = translate(
      'pluralizations',
      {replacements: {count: 2}},
      translations,
      locale,
    );
    expect(translationOther).toBe('I have 2 cars!');
  });

  it('returns selects the proper values for ordinal pluralization', () => {
    const translationFirst = translate(
      'pluralizations',
      {replacements: {ordinal: 1}},
      translations,
      locale,
    );
    const translationSecond = translate(
      'pluralizations',
      {replacements: {ordinal: 2}},
      translations,
      locale,
    );
    const translationThird = translate(
      'pluralizations',
      {replacements: {ordinal: 3}},
      translations,
      locale,
    );
    const translationFourth = translate(
      'pluralizations',
      {replacements: {ordinal: 4}},
      translations,
      locale,
    );
    expect(translationFirst).toBe('This is my 1st car!');
    expect(translationSecond).toBe('This is my 2nd car!');
    expect(translationThird).toBe('This is my 3rd car!');
    expect(translationFourth).toBe('This is my 4th car!');
  });

  it('returns an array when a complex replacement is used', () => {
    const bar = [<span>bar</span>];
    const replacements = {bar};
    const translation = translate('test', {replacements}, translations, locale);

    expect(translation).toMatchObject(['foo ', bar, ' baz']);
  });

  it('returns an array when null is used as a replacement value', () => {
    const translation = translate(
      'test',
      {replacements: {bar: null}},
      translations,
      locale,
    );

    expect(translation).toMatchObject(['foo ', null, ' baz']);
  });

  it.each([2, 'bar', true, false, undefined, NaN])(
    'returns a string when a simple replacement is used',
    (replacementValue) => {
      const replacements = {bar: replacementValue};
      const translation = translate(
        'test',
        {replacements},
        translations,
        locale,
      );

      expect(translation).toBe(`foo ${replacementValue} baz`);
    },
  );
});

function sanitizeSpaces(input) {
  return input
    .replace('\xa0', ' ')
    .replace('\u202f', ' ')
    .replace('\u00A0', ' ');
}
