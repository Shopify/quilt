import hslObject, {hslaObject} from '../hslObject';

describe('hslToObject', () => {
  it('returns a hsl color', () => {
    const color = hslObject('hsl(0, 0, 0.75)');
    expect(color).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 0.75,
    });
  });

  it('returns a hsla color if the argument contains alpha', () => {
    const color = hslObject('hsla(0, 0, 0.75, .2)');
    expect(color).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 0.75,
      alpha: 0.2,
    });
  });

  it('returns a hsl color with the minimum values if a match is not found', () => {
    const color = hslObject('hsla');
    expect(color).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 0,
    });
  });
});

describe('hslaObject', () => {
  it('equals hslObject', () => {
    expect(hslaObject).toEqual(hslObject);
  });
});
