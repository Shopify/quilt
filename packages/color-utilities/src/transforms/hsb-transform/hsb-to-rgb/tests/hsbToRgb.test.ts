import hsbToRgb from '../hsbToRgb';

describe('hsbToRgb', () => {
  it('converts hsb to rgb', () => {
    const rgbColor = hsbToRgb({
      hue: 340,
      saturation: 0.49,
      brightness: 0.86,
      alpha: 1,
    });
    expect(rgbColor).toEqual({red: 219, green: 112, blue: 148, alpha: 1});
  });
});
