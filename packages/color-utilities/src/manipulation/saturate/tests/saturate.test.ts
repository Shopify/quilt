import saturate from '../saturate';

describe('saturate', () => {
  it('returns the original color thats saturated by the given amount', () => {
    const saturatedColor = saturate(
      {hue: 80, saturation: 50, lightness: 60},
      10,
    );
    expect(saturatedColor).toEqual({hue: 80, saturation: 60, lightness: 60});
  });

  it('will not return a saturation above 100', () => {
    const saturatedColor = saturate(
      {hue: 80, saturation: 50, lightness: 60},
      100,
    );
    expect(saturatedColor).toEqual({hue: 80, saturation: 100, lightness: 60});
  });

  it('will not return a saturation below 0', () => {
    const saturatedColor = saturate(
      {hue: 80, saturation: 50, lightness: 60},
      -100,
    );
    expect(saturatedColor).toEqual({hue: 80, saturation: 0, lightness: 60});
  });

  it('returns the original color when a saturate value is not provided', () => {
    const saturatedColor = saturate({hue: 80, saturation: 50, lightness: 50});
    expect(saturatedColor).toEqual({hue: 80, saturation: 50, lightness: 50});
  });
});
