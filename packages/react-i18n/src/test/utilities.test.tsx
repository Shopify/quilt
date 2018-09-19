import * as React from 'react';
import {translate, PSEUDOTRANSLATE_OPTIONS} from '../utilities';

const {pseudotranslate} = require.requireMock('@shopify/i18n') as {
  pseudotranslate: jest.Mock;
};

const locale = 'en-us';

jest.mock('@shopify/i18n', () => ({
  pseudotranslate: jest.fn(),
}));

describe('translate()', () => {
  beforeEach(() => {
    pseudotranslate.mockReset();
    pseudotranslate.mockImplementation((text: string) => text);
  });

  it('throws a MissingTranslationError when no translation is found', () => {
    expect(() => translate('foo', {}, {}, locale)).toThrow();
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

    it('uses the pluralization rules of the provided locale when a replacement named `count` is passed', () => {
      const dictionary = {foo: {one: '{count} foo', other: '{count} foos'}};
      expect(
        translate('foo', {replacements: {count: 1}}, dictionary, locale),
      ).toBe('1 foo');
      expect(
        translate('foo', {replacements: {count: 2}}, dictionary, locale),
      ).toBe('2 foos');
    });

    it('throws a MissingReplacementError when there is a missing replacement', () => {
      expect(() =>
        translate('foo', {}, {foo: 'bar: {bar}'}, locale),
      ).toThrowError('No replacement found for key');
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
});
