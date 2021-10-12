import {getLocaleIds} from '../shared';

describe('getLocaleIds()', () => {
  it('returns an array without the fallbackLocale', () => {
    const translationFilePaths = [
      './src/components/MyComponent/translations/en.json',
      './src/components/MyComponent/translations/fr.json',
      './src/components/MyComponent/translations/jp.json',
      './src/components/MyComponent/translations/zh-TW.json',
    ];

    const result = getLocaleIds({
      translationFilePaths,
      fallbackLocale: 'en',
    });
    expect(result).not.toContain('en');
  });

  it('returns an array with all the locale names in array form', () => {
    const translationFilePaths = [
      './src/components/MyComponent/translations/en.json',
      './src/components/MyComponent/translations/fr.json',
      './src/components/MyComponent/translations/jp.json',
      './src/components/MyComponent/translations/zh-TW.json',
    ];

    const result = getLocaleIds({translationFilePaths});
    expect(result).toStrictEqual(['fr', 'jp', 'zh-TW']);
  });

  it('returns an array in sorted order', () => {
    const translationFilePaths = [
      './src/components/MyComponent/translations/zh-TW.json',
      './src/components/MyComponent/translations/jp.json',
      './src/components/MyComponent/translations/fr.json',
      './src/components/MyComponent/translations/en.json',
    ];

    const result = getLocaleIds({translationFilePaths});
    expect(result).toStrictEqual(['fr', 'jp', 'zh-TW']);
  });
});
