import hexToHsb from '../hexToHsb';

describe('hexToHsb', () => {
  it('converts hex to hsb', () => {
    const hsbColor = hexToHsb('#778899');
    expect(hsbColor).toEqual({
      hue: 210,
      saturation: 0.22,
      brightness: 0.6,
      alpha: 1,
    });
  });
});
