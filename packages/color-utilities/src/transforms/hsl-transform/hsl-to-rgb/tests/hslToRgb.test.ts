import hslToRgb from '../hslToRgb';

describe('hslToRgb', () => {
  it('converts hsl to rgb', () => {
    const rgbColor = hslToRgb({
      hue: 0,
      saturation: 0,
      lightness: 82.75,
      alpha: 1,
    });
    expect(rgbColor).toEqual({
      red: 211,
      green: 211,
      blue: 211,
      alpha: 1,
    });
  });
});
