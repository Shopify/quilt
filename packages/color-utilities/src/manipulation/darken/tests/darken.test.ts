import darken from '../darken';

describe('darken', () => {
  it('returns the original color darkened by the given amount', () => {
    const darkenedColor = darken({hue: 80, saturation: 5, lightness: 50}, 10);
    expect(darkenedColor).toEqual({hue: 80, saturation: 5, lightness: 40});
  });

  it('will not return a lightness below 0', () => {
    const darkenedColor = darken({hue: 80, saturation: 5, lightness: 50}, 1000);
    expect(darkenedColor).toEqual({hue: 80, saturation: 5, lightness: 0});
  });

  it('will not return a lightness above 100', () => {
    const darkenedColor = darken(
      {hue: 80, saturation: 5, lightness: 50},
      -1000,
    );
    expect(darkenedColor).toEqual({hue: 80, saturation: 5, lightness: 100});
  });

  it('returns the original color when a value is not provided', () => {
    const darkenedColor = darken({hue: 80, saturation: 5, lightness: 50});
    expect(darkenedColor).toEqual({hue: 80, saturation: 5, lightness: 50});
  });
});
