import {languageFromLocale, regionFromLocale} from '../locale';

describe('languageFromLocale()', () => {
  it('returns the language subtag', () => {
    expect(languageFromLocale('fr-CA')).toBe('fr');
  });
});

describe('regionFromLocale()', () => {
  it('returns undefined when no region exists', () => {
    expect(regionFromLocale('fr')).toBeUndefined();
  });

  it('returns the region subtag when it exists', () => {
    expect(regionFromLocale('fr-CA')).toBe('CA');
  });

  it('normalizes the region subtag to uppercase', () => {
    expect(regionFromLocale('fr-ca')).toBe('CA');
  });
});
