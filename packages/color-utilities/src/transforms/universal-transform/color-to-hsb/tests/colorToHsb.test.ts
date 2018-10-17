import colorToHsb from '../colorToHsb';

describe('colorToHsb', () => {
  it('converts keyword to hsb', () => {
    const hsbColor = colorToHsb('papayawhip');
    expect(hsbColor).toEqual({
      hue: 37,
      saturation: 0.16,
      brightness: 1,
      alpha: 1,
    });
  });

  it('converts rgb to hsb', () => {
    const hsbColor = colorToHsb({
      red: 0,
      green: 0,
      blue: 128,
    });
    expect(hsbColor).toEqual({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
      alpha: 1,
    });
  });

  it('converts rgba to hsb', () => {
    const hsbColor = colorToHsb({
      red: 0,
      green: 0,
      blue: 128,
      alpha: 1,
    });
    expect(hsbColor).toEqual({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
      alpha: 1,
    });
  });

  it('converts hex to hsb', () => {
    const hsbColor = colorToHsb('#000080');
    expect(hsbColor).toEqual({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
      alpha: 1,
    });
  });

  it('converts hsl to hsb', () => {
    const hsbColor = colorToHsb({
      hue: 34,
      saturation: 56.99999999999999,
      lightness: 70,
    });
    expect(hsbColor).toEqual({
      hue: 34,
      saturation: 0.39,
      brightness: 0.87,
      alpha: 1,
    });
  });

  it('converts hsla to hsb', () => {
    const hsbColor = colorToHsb({
      hue: 34,
      saturation: 56.99999999999999,
      lightness: 70,
      alpha: 1,
    });
    expect(hsbColor).toEqual({
      hue: 34,
      saturation: 0.39,
      brightness: 0.87,
      alpha: 1,
    });
  });

  it('returns the provided argument if the color type is not support', () => {
    const hsbColor = colorToHsb('not a color');
    expect(hsbColor).toBe('not a color');
  });

  it('returns the provided argument if the color provided is a hsb value', () => {
    const hsb = {
      hue: 180,
      saturation: 0.06,
      brightness: 1,
      alpha: 1,
    };
    const hsbColor = colorToHsb(hsb);
    expect(hsbColor).toBe(hsb);
  });
});
