import componentToHex from '../componentToHex';

describe('componentToHex', () => {
  it('returns a hex string from a number', () => {
    const hexNumber = componentToHex(256);
    expect(hexNumber).toBe('100');
  });

  it('returns a prefix of 0 for hex numbers below 9', () => {
    const hexNumber = componentToHex(4);
    expect(hexNumber).toBe('04');
  });
});
