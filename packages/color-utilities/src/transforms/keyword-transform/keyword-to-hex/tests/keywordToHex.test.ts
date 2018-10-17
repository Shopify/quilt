import keywordToHex from '../keywordToHex';

describe('keywordToHex', () => {
  it('returns the hex value for the keyword', () => {
    const color = keywordToHex('yellowgreen');
    expect(color).toBe('#9acd32');
  });
});
