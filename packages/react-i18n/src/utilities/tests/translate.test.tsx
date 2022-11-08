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
