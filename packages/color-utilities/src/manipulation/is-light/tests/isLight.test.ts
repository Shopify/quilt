import isLight from '../isLight';

describe('isLight', () => {
  it('returns undefined if the argument is not a color', () => {
    const isColorLight = isLight('not a color');
    expect(isColorLight).toBeUndefined();
  });

  it('returns undefined for a color type is type default', () => {
    const isColorLight = isLight({} as any);
    expect(isColorLight).toBeUndefined();
  });

  it('returns true for light colors', () => {
    const isColorLight = isLight('#B7ECEC');
    expect(isColorLight).toBe(true);
  });

  it('returns false for dark colors', () => {
    const isColorLight = isLight('#00848E');
    expect(isColorLight).toBe(false);
  });
});
