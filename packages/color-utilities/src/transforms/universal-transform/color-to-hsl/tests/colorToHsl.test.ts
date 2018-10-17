import colorToHsl from '../colorToHsl';

describe('colorToHsl', () => {
  it('converts keyword to hsl', () => {
    const hslColor = colorToHsl('papayawhip');
    expect(hslColor).toEqual({
      hue: 37,
      saturation: 100,
      lightness: 92,
      alpha: 1,
    });
  });

  it('converts rgb to hsl', () => {
    const hslColor = colorToHsl({
      red: 0,
      green: 0,
      blue: 128,
    });
    expect(hslColor).toEqual({
      hue: 240,
      saturation: 100,
      lightness: 25,
      alpha: 1,
    });
  });

  it('converts rgba to hsl', () => {
    const hslColor = colorToHsl({
      red: 0,
      green: 0,
      blue: 128,
      alpha: 1,
    });
    expect(hslColor).toEqual({
      hue: 240,
      saturation: 100,
      lightness: 25,
      alpha: 1,
    });
  });

  it('converts hex to hsl', () => {
    const hslColor = colorToHsl('#000080');
    expect(hslColor).toEqual({
      hue: 240,
      saturation: 100,
      lightness: 25,
      alpha: 1,
    });
  });

  it('converts hsb to hsl', () => {
    const hslColor = colorToHsl({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
    });
    expect(hslColor).toEqual({
      hue: 240,
      saturation: 100,
      lightness: 25,
      alpha: 1,
    });
  });

  it('converts hsba to hsl', () => {
    const hslColor = colorToHsl({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
      alpha: 1,
    });
    expect(hslColor).toEqual({
      hue: 240,
      saturation: 100,
      lightness: 25,
      alpha: 1,
    });
  });

  it('returns the provided argument if the color type is not support', () => {
    const hslColor = colorToHsl('not a color');
    expect(hslColor).toBe('not a color');
  });

  it('returns the provided argument if the color provided is a hsl value', () => {
    const hsl = {
      hue: 240,
      saturation: 100,
      lightness: 25,
      alpha: 1,
    };
    const hslColor = colorToHsl(hsl);
    expect(hslColor).toBe(hsl);
  });
});
