import rgbToHsl from '../rgbToHsl';

describe('rgbToHsl', () => {
  it('converts rgb to hsl', () => {
    const hslColor = rgbToHsl({
      red: 250,
      green: 128,
      blue: 114,
    });
    expect(hslColor).toEqual({
      hue: 6,
      saturation: 54,
      lightness: 71,
      alpha: 1,
    });
  });
});
