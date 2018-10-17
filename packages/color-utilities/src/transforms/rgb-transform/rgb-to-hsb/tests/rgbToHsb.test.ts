import rgbToHsb from '../rgbToHsb';

describe('rgbToHsb', () => {
  it('convert rgb to hsb', () => {
    const hsbColor = rgbToHsb({
      red: 218,
      green: 112,
      blue: 214,
    });
    expect(hsbColor).toEqual({
      hue: 302,
      saturation: 0.49,
      brightness: 0.85,
      alpha: 1,
    });
  });
});
