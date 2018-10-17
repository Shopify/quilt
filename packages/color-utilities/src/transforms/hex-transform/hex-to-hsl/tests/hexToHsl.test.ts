import hexToHsl from '../hexToHsl';

describe('hexToHsl', () => {
  it('converts hex to hsl', () => {
    const hsbColor = hexToHsl('#778899');
    expect(hsbColor).toEqual({
      hue: 210,
      lightness: 53,
      saturation: 22,
      alpha: 1,
    });
  });
});
