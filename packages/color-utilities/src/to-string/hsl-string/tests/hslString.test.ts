import hslString, {hslaString} from '../hslString';

describe('hslString', () => {
  it('returns a hsl color', () => {
    const color = hslString({
      hue: 0,
      saturation: 0,
      lightness: 0.75,
    });
    expect(color).toBe('hsl(0, 0, 0.75)');
  });

  it('returns a hsla color if the argument contains alpha', () => {
    const color = hslString({
      hue: 0,
      saturation: 0,
      lightness: 0.75,
      alpha: 1,
    });
    expect(color).toBe('hsla(0, 0, 0.75, 1)');
  });
});

describe('hslaString', () => {
  it('equals hslString', () => {
    expect(hslaString).toEqual(hslString);
  });
});
