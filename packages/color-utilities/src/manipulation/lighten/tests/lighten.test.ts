import lighten from '../lighten';

describe('lighten', () => {
  it('returns the original color darkened by the given amount', () => {
    const lightenedColor = lighten({hue: 80, saturation: 5, lightness: 50}, 10);
    expect(lightenedColor).toEqual({hue: 80, saturation: 5, lightness: 60});
  });

  it('will not return a lightness above 100', () => {
    const lightenedColor = lighten(
      {hue: 80, saturation: 5, lightness: 50},
      1000,
    );
    expect(lightenedColor).toEqual({hue: 80, saturation: 5, lightness: 100});
  });

  it('will not return a lightness below 0', () => {
    const lightenedColor = lighten(
      {hue: 80, saturation: 5, lightness: 50},
      -1000,
    );
    expect(lightenedColor).toEqual({hue: 80, saturation: 5, lightness: 0});
  });

  it('returns the original color when a lighten value is not provided', () => {
    const lightenedColor = lighten({hue: 80, saturation: 5, lightness: 50});
    expect(lightenedColor).toEqual({hue: 80, saturation: 5, lightness: 50});
  });
});
