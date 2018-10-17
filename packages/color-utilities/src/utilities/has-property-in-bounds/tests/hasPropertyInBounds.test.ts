import hasPropertyInBounds from '../hasPropertyInBounds';

describe('hasPropertyInBounds', () => {
  it('returns false if the value does not exist', () => {
    const existsInBounds = hasPropertyInBounds(
      {red: 0, blue: 0, green: 0},
      'alpha',
      0,
      1,
    );
    expect(existsInBounds).toBe(false);
  });

  it('returns true if the property exists and is within the bounds', () => {
    const existsInBounds = hasPropertyInBounds(
      {red: 0, blue: 0, green: 0},
      'red',
      0,
      1,
    );
    expect(existsInBounds).toBe(true);
  });
});
