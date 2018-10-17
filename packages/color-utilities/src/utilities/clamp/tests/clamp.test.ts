import clamp from '../clamp';

describe('clamp', () => {
  it('returns the high when the number is greater than the max', () => {
    const num = clamp(20, 10, 19);
    expect(num).toBe(19);
  });

  it('returns the low when the number is less than the low', () => {
    const num = clamp(20, 21, 30);
    expect(num).toBe(21);
  });

  it('returns the number', () => {
    const num = clamp(20, 10, 30);
    expect(num).toBe(20);
  });

  it('returns the number when the number is equal to the low', () => {
    const num = clamp(21, 21, 30);
    expect(num).toBe(21);
  });

  it('returns the number when the number is equal to the high', () => {
    const num = clamp(30, 21, 30);
    expect(num).toBe(30);
  });
});
