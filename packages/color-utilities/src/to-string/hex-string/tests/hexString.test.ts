import hexString from '../hexString';

describe('hexString', () => {
  it('returns a hex color', () => {
    const color = hexString('eeeeee');
    expect(color).toBe('#eeeeee');
  });

  it('returns a long hex color from a short hex code', () => {
    const color = hexString('eee');
    expect(color).toBe('#eeeeee');
  });
});
