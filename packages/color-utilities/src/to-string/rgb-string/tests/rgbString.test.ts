import rgbString, {rgbaString} from '../rgbString';

describe('rgbString', () => {
  it('returns a rgb color', () => {
    const color = rgbString({
      red: 47,
      green: 79,
      blue: 79,
    });
    expect(color).toBe('rgb(47, 79, 79)');
  });

  it('returns a rgba color if the argument contains alpha', () => {
    const color = rgbString({
      red: 47,
      green: 79,
      blue: 79,
      alpha: 0.4,
    });
    expect(color).toBe('rgba(47, 79, 79, 0.4)');
  });
});

describe('rgbaString', () => {
  it('equals rgbString', () => {
    expect(rgbaString).toEqual(rgbString);
  });
});
