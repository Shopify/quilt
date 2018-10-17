import noop from '../noop';

describe('noop', () => {
  it('is a function', () => {
    expect(typeof noop === 'function').toBe(true);
  });

  it('returns undefined', () => {
    const noopResult = noop();
    expect(noopResult).toBeUndefined();
  });
});
