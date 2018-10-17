import hsbString, {hsbaString} from '../hsbString';

describe('hsbString', () => {
  it('returns a hsb color', () => {
    const color = hsbString({
      brightness: 0.75,
      saturation: 0,
      hue: 0,
    });
    expect(color).toBe('hsb(0, 0, 0.75)');
  });

  it('returns a hsba color if the argument contains alpha', () => {
    const color = hsbString({
      hue: 0,
      saturation: 0,
      brightness: 0.75,
      alpha: 1,
    });
    expect(color).toBe('hsba(0, 0, 0.75, 1)');
  });
});

describe('hsbaString', () => {
  it('equals hsbString', () => {
    expect(hsbaString).toEqual(hsbString);
  });
});
