import rgbToHex from '../rgbToHex';

describe('rgbToHex', () => {
  it('converts rgb to hex', () => {
    const hexColor = rgbToHex({
      red: 255,
      green: 182,
      blue: 193,
    });
    expect(hexColor).toBe('#ffb6c1');
  });
});
