import hslToHsb from '../hslToHsb';

describe('hslToHsb', () => {
  it('converts hsl to hsb', () => {
    const hsbColor = hslToHsb({
      hue: 30,
      saturation: 8,
      lightness: 94.12,
    });
    expect(hsbColor).toEqual({
      hue: 30,
      saturation: 0.01,
      brightness: 0.95,
      alpha: 1,
    });
  });
});
