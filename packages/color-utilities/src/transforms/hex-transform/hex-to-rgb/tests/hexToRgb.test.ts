import hexToRgb from '../hexToRgb';

describe('hexToRgb', () => {
  it('converts a hex string to rgb object', () => {
    const rgbColor = hexToRgb('#4b0082');
    expect(rgbColor).toEqual({red: 75, green: 0, blue: 130});
  });

  it('converts a short hex string to rgb object', () => {
    const rgbColor = hexToRgb('#4b0');
    expect(rgbColor).toEqual({red: 68, green: 187, blue: 0});
  });
});
