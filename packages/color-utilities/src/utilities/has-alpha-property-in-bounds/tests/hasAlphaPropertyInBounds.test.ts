import hasAlphaPropertyInBounds from '../hasAlphaPropertyInBounds';

describe('existsAndWithinBounds', () => {
  it("returns false if the color has alpha and it's not in bounds", () => {
    const existsInBounds = hasAlphaPropertyInBounds({alpha: 2}, 0, 1);
    expect(existsInBounds).toBe(false);
  });

  it('returns true if the color does not have alpha', () => {
    const existsInBounds = hasAlphaPropertyInBounds({}, 0, 1);
    expect(existsInBounds).toBe(true);
  });

  it('returns true if the color has alpha', () => {
    const existsInBounds = hasAlphaPropertyInBounds({alpha: 0.5}, 0, 1);
    expect(existsInBounds).toBe(true);
  });
});
