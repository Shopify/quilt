import {
  memoizedNumberFormatter,
  numberFormatCacheKey,
} from '../functionHelpers';

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

function sanitizeSpaces(input) {
  return input
    .replace('\xa0', ' ')
    .replace('\u202f', ' ')
    .replace('\u00A0', ' ');
}
