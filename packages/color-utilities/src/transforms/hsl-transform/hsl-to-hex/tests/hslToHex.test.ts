import hslToHex from '../hslToHex';

describe('hslToHex', () => {
  it('convert hsl to hex', () => {
    const hexColor = hslToHex({
      hue: 0,
      saturation: 0,
      lightness: 75.29,
      alpha: 1,
    });
    expect(hexColor).toBe('#c0c0c0');
  });
});
