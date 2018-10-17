import hsbObject, {hsbaObject} from '../hsbObject';

describe('hsbToObject', () => {
  it('returns a hsb color', () => {
    const color = hsbObject('hsb(0, 0, 0.75)');
    expect(color).toEqual({
      hue: 0,
      saturation: 0,
      brightness: 0.75,
    });
  });

  it('returns a hsba color if the argument contains alpha', () => {
    const color = hsbObject('hsba(0, 0, 0.75, .2)');
    expect(color).toEqual({
      hue: 0,
      saturation: 0,
      brightness: 0.75,
      alpha: 0.2,
    });
  });

  it('returns a hsb color with the minimum values if a match is not found', () => {
    const color = hsbObject('hsba');
    expect(color).toEqual({
      hue: 0,
      saturation: 0,
      brightness: 0,
    });
  });
});

describe('hsbaObject', () => {
  it('equals hsbObject', () => {
    expect(hsbaObject).toEqual(hsbObject);
  });
});
