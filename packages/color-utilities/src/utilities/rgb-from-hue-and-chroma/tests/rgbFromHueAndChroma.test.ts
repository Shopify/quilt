import rgbFromHueAndChroma from '../rgbFromHueAndChroma';

describe('rgbFromHueAndChroma', () => {
  it('returns the correct values when hue prime is between 0-1', () => {
    const rgb = rgbFromHueAndChroma(30, 0.3);
    expect(rgb).toEqual({red: 0.3, green: 0.15, blue: 0});
  });

  it('returns the correct values when hue prime is between 1-2', () => {
    const rgb = rgbFromHueAndChroma(70, 0.5);
    expect(rgb).toEqual({red: 0.41666666666666663, green: 0.5, blue: 0});
  });

  it('returns the correct values when hue prime is between 2-3', () => {
    const rgb = rgbFromHueAndChroma(125, 0.7);
    expect(rgb).toEqual({red: 0, green: 0.7, blue: 0.05833333333333343});
  });

  it('returns the correct values when hue prime is between 3-4', () => {
    const rgb = rgbFromHueAndChroma(200, 0.3);
    expect(rgb).toEqual({red: 0, green: 0.19999999999999996, blue: 0.3});
  });

  it('returns the correct values when hue prime is between 4-5', () => {
    const rgb = rgbFromHueAndChroma(250, 0.6);
    expect(rgb).toEqual({red: 0.10000000000000017, green: 0, blue: 0.6});
  });

  it('returns the correct values when hue prime is between 5-6', () => {
    const rgb = rgbFromHueAndChroma(310, 0.1);
    expect(rgb).toEqual({red: 0.1, green: 0, blue: 0.08333333333333331});
  });
});
