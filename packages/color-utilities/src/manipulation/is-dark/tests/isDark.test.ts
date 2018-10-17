import isDark from '../isDark';

describe('isDark', () => {
  it('returns undefined if the argument is not a color', () => {
    const isColorDark = isDark('not a color');
    expect(isColorDark).toBeUndefined();
  });

  it('returns false for light colors', () => {
    const isColorDark = isDark('#B7ECEC');
    expect(isColorDark).toBe(false);
  });

  it('returns true for dark colors', () => {
    const isColorDark = isDark('#00848E');
    expect(isColorDark).toBe(true);
  });
});
