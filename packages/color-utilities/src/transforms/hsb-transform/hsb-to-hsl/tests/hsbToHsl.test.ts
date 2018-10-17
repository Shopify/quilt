import hsbToHsl from '../hsbToHsl';

describe('hsbToHsl', () => {
  it('converts hsb to hsl', () => {
    const hslColor = hsbToHsl({
      hue: 30,
      saturation: 0.08,
      brightness: 0.98,
      alpha: 1,
    });
    expect(hslColor).toEqual({
      hue: 30,
      saturation: 8,
      lightness: 94,
      alpha: 1,
    });
  });
});
