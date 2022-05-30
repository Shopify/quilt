import React from 'react';

import {numberFormatCacheKey, translate} from '../translate';

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
    [id]: 'foo {bar}',
  };
  const locale = 'en-CA';

  it('returns an array when a complex replacement is used', () => {
    const bar = <span>bar</span>;
    const replacements = {bar};
    const translation = translate('test', {replacements}, translations, locale);

    expect(translation).toMatchObject([
      'foo ',
      React.cloneElement(bar, {key: 1}),
    ]);
  });

  it.each([2, 'bar', true, false, null, undefined, NaN])(
    'returns a string when a simple replacement is used',
    (replacementValue) => {
      const replacements = {bar: replacementValue};
      const translation = translate(
        'test',
        {replacements},
        translations,
        locale,
      );

      expect(translation).toBe(`foo ${replacementValue}`);
    },
  );
});
