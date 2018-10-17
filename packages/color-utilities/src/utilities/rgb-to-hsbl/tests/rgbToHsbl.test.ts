import rgbToHsbl from '../rgbToHsbl';

describe('rgbToHsbl', () => {
  it('returns a min hsbl color when the largest component is 0', () => {
    const hsbl = rgbToHsbl({red: 0, green: 0, blue: 0});
    expect(hsbl).toEqual({
      hue: 0,
      saturation: 0,
      brightness: 0,
      lightness: 0,
      alpha: 1,
    });
  });

  it('returns the correct hsbl color when red is the largest component', () => {
    const hsbl = rgbToHsbl({red: 100, green: 0, blue: 0});
    expect(hsbl).toEqual({
      hue: 0,
      saturation: 1,
      brightness: 0.39,
      lightness: 0.2,
      alpha: 1,
    });
  });

  it('returns the correct hsbl color when blue is the largest component', () => {
    const hsbl = rgbToHsbl({red: 0, green: 0, blue: 240});
    expect(hsbl).toEqual({
      hue: 240,
      saturation: 1,
      brightness: 0.94,
      lightness: 0.47,
      alpha: 1,
    });
  });

  it('returns the correct hsbl color when green is the largest component', () => {
    const hsbl = rgbToHsbl({red: 0, green: 77, blue: 0});
    expect(hsbl).toEqual({
      hue: 120,
      saturation: 1,
      brightness: 0.3,
      lightness: 0.15,
      alpha: 1,
    });
  });

  it('returns the correct values when the type is b', () => {
    const hsbl = rgbToHsbl({red: 0, green: 77, blue: 0}, 'b');
    expect(hsbl).toEqual({
      hue: 120,
      saturation: 1,
      brightness: 0.3,
      lightness: 0.15,
      alpha: 1,
    });
  });

  it('returns the correct values when the type is l', () => {
    const hsbl = rgbToHsbl({red: 0, green: 77, blue: 0}, 'l');
    expect(hsbl).toEqual({
      hue: 120,
      saturation: 1,
      brightness: 0.3,
      lightness: 0.15,
      alpha: 1,
    });
  });

  it('returns the correct saturation when the type is l and lightness below .5', () => {
    const hsbl = rgbToHsbl({red: 0, green: 77, blue: 0}, 'l');
    expect(hsbl).toEqual({
      hue: 120,
      saturation: 1,
      brightness: 0.3,
      lightness: 0.15,
      alpha: 1,
    });
  });

  it('returns the correct saturation when the type is l and the lightness is above .5', () => {
    const hsbl = rgbToHsbl({red: 100, green: 256, blue: 100}, 'l');
    expect(hsbl).toEqual({
      hue: 120,
      saturation: 1,
      brightness: 1,
      lightness: 0.7,
      alpha: 1,
    });
  });
});
