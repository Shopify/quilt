import hsbToHex from '../hsbToHex';

describe('hsbToHex', () => {
  it('converts hsb to hex', () => {
    const rgbColor = hsbToHex({
      hue: 302,
      saturation: 0.48,
      brightness: 0.85,
      alpha: 1,
    });
    expect(rgbColor).toBe('#d971d5');
  });
});
