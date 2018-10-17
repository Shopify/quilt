import keywordToRgb from '../keywordToRgb';

describe('keywordToRgb', () => {
  it('returns the rgb value for the keyword', () => {
    const color = keywordToRgb('lightslategray');
    expect(color).toEqual({red: 119, green: 136, blue: 153});
  });
});
