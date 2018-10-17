import desaturate from '../desaturate';

describe('desaturate', () => {
  it('returns the original color desaturated by the given amount', () => {
    const desaturatedColor = desaturate(
      {hue: 80, saturation: 50, lightness: 60},
      10,
    );
    expect(desaturatedColor).toEqual({
      hue: 80,
      saturation: 40,
      lightness: 60,
    });
  });

  it('returns the original color when a value is not provided', () => {
    const desaturatedColor = desaturate({
      hue: 80,
      saturation: 50,
      lightness: 50,
    });
    expect(desaturatedColor).toEqual({
      hue: 80,
      saturation: 50,
      lightness: 50,
    });
  });
});
