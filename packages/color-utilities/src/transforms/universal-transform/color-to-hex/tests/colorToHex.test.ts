import colorToHex from '../colorToHex';

describe('colorToHex', () => {
  it('converts keyword to hex', () => {
    const hexColor = colorToHex('papayawhip');
    expect(hexColor).toBe('#ffefd5');
  });

  it('converts rgb to hex', () => {
    const hexColor = colorToHex({
      red: 0,
      green: 0,
      blue: 128,
    });
    expect(hexColor).toBe('#000080');
  });

  it('converts rgba to hex', () => {
    const hexColor = colorToHex({
      red: 0,
      green: 0,
      blue: 128,
      alpha: 1,
    });
    expect(hexColor).toBe('#000080');
  });

  it('converts hsl to hex', () => {
    const hexColor = colorToHex({
      hue: 240,
      saturation: 100,
      lightness: 25.09,
    });
    expect(hexColor).toBe('#000080');
  });

  it('converts hsla to hex', () => {
    const hexColor = colorToHex({
      hue: 240,
      saturation: 100,
      lightness: 25.1,
      alpha: 1,
    });
    expect(hexColor).toBe('#000080');
  });

  it('converts hsb to hex', () => {
    const hexColor = colorToHex({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
    });
    expect(hexColor).toBe('#000080');
  });

  it('converts hsba to hex', () => {
    const hexColor = colorToHex({
      hue: 240,
      saturation: 1,
      brightness: 0.5,
      alpha: 1,
    });
    expect(hexColor).toBe('#000080');
  });

  it('returns the provided argument if the color type is not support', () => {
    const hexColor = colorToHex('not a color');
    expect(hexColor).toBe('not a color');
  });

  it('returns the provided argument if the color provided is a hex value', () => {
    const hexColor = colorToHex('#000080');
    expect(hexColor).toBe('#000080');
  });
});
