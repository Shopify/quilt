import colorToRgb from '../colorToRgb';

describe('colorToRgb', () => {
  it('converts keyword to rgb', () => {
    const rgbColor = colorToRgb('papayawhip');
    expect(rgbColor).toEqual({
      red: 255,
      green: 239,
      blue: 213,
    });
  });

  it('converts hsb to rgb', () => {
    const rgbColor = colorToRgb({
      hue: 37,
      saturation: 0.16,
      brightness: 1,
    });
    expect(rgbColor).toEqual({
      red: 255,
      green: 239,
      blue: 214,
      alpha: 1,
    });
  });

  it('converts hsba to rgb', () => {
    const hsbColor = colorToRgb({
      hue: 37,
      saturation: 0.16,
      brightness: 1,
      alpha: 1,
    });
    expect(hsbColor).toEqual({
      red: 255,
      green: 239,
      blue: 214,
      alpha: 1,
    });
  });

  it('converts hex to rgb', () => {
    const rgbColor = colorToRgb('#ffefd5');
    expect(rgbColor).toEqual({
      red: 255,
      green: 239,
      blue: 213,
    });
  });

  it('converts hsl to rgb', () => {
    const rgbColor = colorToRgb({
      hue: 37,
      saturation: 100,
      lightness: 92,
    });
    expect(rgbColor).toEqual({
      red: 255,
      green: 239,
      blue: 214,
      alpha: 1,
    });
  });

  it('converts hsla to rgb', () => {
    const rgbColor = colorToRgb({
      hue: 37,
      saturation: 100,
      lightness: 92,
      alpha: 1,
    });
    expect(rgbColor).toEqual({
      red: 255,
      green: 239,
      blue: 214,
      alpha: 1,
    });
  });

  it('returns the provided argument if the color type is not support', () => {
    const rgbColor = colorToRgb('not a color');
    expect(rgbColor).toBe('not a color');
  });

  it('returns the provided argument if the color provided is a hsb value', () => {
    const rgb = {
      red: 255,
      green: 239,
      blue: 214,
      alpha: 1,
    };
    const rgbColor = colorToRgb(rgb);
    expect(rgbColor).toBe(rgb);
  });
});
