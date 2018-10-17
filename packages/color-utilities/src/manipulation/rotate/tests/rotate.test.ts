import rotate from '../rotate';

describe('rotate', () => {
  it("returns the original color that's rotated by the given amount", () => {
    const rotatedColor = rotate({hue: 80, saturation: 5, lightness: 50}, 200);
    expect(rotatedColor).toEqual({hue: 280, saturation: 5, lightness: 50});
  });

  it('will not return a hue above 360', () => {
    const rotatedColor = rotate({hue: 200, saturation: 5, lightness: 50}, 200);
    expect(rotatedColor).toEqual({hue: 360, saturation: 5, lightness: 50});
  });

  it('will not return a hue below 0', () => {
    const rotatedColor = rotate({hue: 80, saturation: 5, lightness: 50}, -200);
    expect(rotatedColor).toEqual({hue: 0, saturation: 5, lightness: 50});
  });

  it('returns the original color when a rotate value is not provided', () => {
    const rotatedColor = rotate({hue: 80, saturation: 5, lightness: 50});
    expect(rotatedColor).toEqual({hue: 80, saturation: 5, lightness: 50});
  });
});
