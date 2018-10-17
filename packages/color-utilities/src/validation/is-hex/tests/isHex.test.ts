import isHex from '../isHex';

describe('isHex', () => {
  it('returns true when the provided argument is a hex color', () => {
    const isThisHex = isHex('#aaaaaa');
    expect(isThisHex).toBe(true);
  });

  it('returns false when the provided argument is not a hex color', () => {
    const isThisHex = isHex({red: 101, green: 22, blue: 30});
    expect(isThisHex).toBe(false);
  });
});
