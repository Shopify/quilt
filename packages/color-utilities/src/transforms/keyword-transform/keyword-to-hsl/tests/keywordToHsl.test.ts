import keywordToHsl from '../keywordToHsl';

describe('keywordToHsl', () => {
  it('returns the hsl value for the keyword', () => {
    const color = keywordToHsl('slateblue');
    expect(color).toEqual({
      hue: 248,
      saturation: 53,
      lightness: 57.99999999999999,
      alpha: 1,
    });
  });
});
