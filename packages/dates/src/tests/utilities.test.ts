import {dateTimeFormatCacheKey, formatDate} from '../utilities/formatDate';

describe('formatDate()', () => {
  it('formats dates as expected for various locales', () => {
    const date = new Date(2018, 0, 0);
    const tuples = [
      ['en-US', '12/31/2017'],
      ['en-GB', '31/12/2017'],
      ['de-DE', '31.12.2017'],
    ];

    for (const tuple of tuples) {
      const locale = tuple[0];
      const expected = `[${locale}] ${tuple[1]}`;
      const actual = `[${locale}] ${formatDate(date, locale)}`;

      expect(actual).toBe(expected);
    }
  });

  it('formats with the Etc/GMT+12 timezone', () => {
    const date = new Date('2018-01-01T12:34:56-12:00');
    const locale = 'en';
    const timeZone = 'Etc/GMT+12';
    const options = {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const expected = '1/1/2018, 12:34:56 PM';

    expect(formatDate(date, locale, options)).toBe(expected);
  });
});

describe('dateTimeFormatCacheKey()', () => {
  const locale = 'en-CA';
  const otherLocale = 'en-US';
  const options = {timeZone: 'America/Vancouver'};
  const optionsKey = JSON.stringify(options);
  it('creates a key for an undefined locale with options', () => {
    expect(dateTimeFormatCacheKey(undefined, options)).toBe(
      `undefined-${optionsKey}`,
    );
  });

  it('creates a key for an undefined locale without options', () => {
    expect(dateTimeFormatCacheKey()).toBe(`undefined-{}`);
  });

  it('creates a key for a single locale with options', () => {
    expect(dateTimeFormatCacheKey(locale, options)).toBe(
      `${locale}-${optionsKey}`,
    );
  });

  it('creates a key for a single locale without options', () => {
    expect(dateTimeFormatCacheKey(locale)).toBe(`${locale}-{}`);
  });

  it('creates a key for a multiple locales with options', () => {
    expect(dateTimeFormatCacheKey([locale, otherLocale], options)).toBe(
      `${locale}-${otherLocale}-${optionsKey}`,
    );
  });

  it('creates a key for a multiple locales without options', () => {
    expect(dateTimeFormatCacheKey([locale, otherLocale])).toBe(
      `${locale}-${otherLocale}-{}`,
    );
  });

  it('sorts locales when there are multiple', () => {
    expect(dateTimeFormatCacheKey([otherLocale, locale])).toBe(
      `${locale}-${otherLocale}-{}`,
    );
  });
});
