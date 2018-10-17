import rgbObject, {rgbaObject} from '../rgbObject';

describe('rgbToObject', () => {
  it('returns a rgb color', () => {
    const color = rgbObject('rgb(23, 54, 75)');
    expect(color).toEqual({
      red: 23,
      green: 54,
      blue: 75,
    });
  });

  it('returns a rgba color if the argument contains alpha', () => {
    const color = rgbObject('rgba(34, 45, 5, .2)');
    expect(color).toEqual({
      red: 34,
      green: 45,
      blue: 5,
      alpha: 0.2,
    });
  });

  it('returns a rgb color with the minimum values if a match is not found', () => {
    const color = rgbObject('rgba');
    expect(color).toEqual({
      red: 0,
      green: 0,
      blue: 0,
    });
  });
});

describe('rgbaObject', () => {
  it('equals rgbObject', () => {
    expect(rgbaObject).toEqual(rgbObject);
  });
});
