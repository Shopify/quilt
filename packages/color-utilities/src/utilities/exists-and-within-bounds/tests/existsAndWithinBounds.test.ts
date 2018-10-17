import existsAndWithinBounds from '../existsAndWithinBounds';

describe('existsAndWithinBounds', () => {
  it('returns false if the value does not exist', () => {
    const existsInBounds = existsAndWithinBounds(undefined, 0, 1);
    expect(existsInBounds).toBe(false);
  });

  it('returns true if the value is within the bounds', () => {
    const existsInBounds = existsAndWithinBounds(0.5, 0, 1);
    expect(existsInBounds).toBe(true);
  });
});
