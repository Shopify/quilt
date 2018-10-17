import withinBounds from '../withinBounds';

describe('withinBounds', () => {
  it('returns true when the number is between the min and max provided', () => {
    const isWithinBounds = withinBounds(5, 0, 10);
    expect(isWithinBounds).toBe(true);
  });

  it('returns false when the number is not between the min and max provided', () => {
    const isWithinBounds = withinBounds(-1, 0, 10);
    expect(isWithinBounds).toBe(false);
  });

  it('returns true when the number is the min or max', () => {
    const isWithinBounds = withinBounds(1, 1, 1);
    expect(isWithinBounds).toBe(true);
  });
});
