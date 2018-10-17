import matchParantheses from '../matchParantheses';

describe('matchParantheses', () => {
  it('returns an array if a match is found', () => {
    const content = matchParantheses('rgb(1,2,3)');
    expect(Array.isArray(content)).toBe(true);
  });

  it('returns an null if a match is not found', () => {
    const content = matchParantheses('rgb 1,2,3');
    expect(content).toBe(null);
  });

  it('returns the full match at index 0', () => {
    const content = matchParantheses('rgb(1,2,3)');
    expect(content && content[0]).toBe('(1,2,3)');
  });

  it('returns the matches at index 1', () => {
    const content = matchParantheses('rgb(1,2,3)(4,5,6)');
    expect(content && content[1]).toBe('1,2,3');
  });
});
