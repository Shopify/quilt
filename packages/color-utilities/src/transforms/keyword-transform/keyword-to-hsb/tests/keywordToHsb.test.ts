import keywordToHsb from '../keywordToHsb';

describe('keywordToHsb', () => {
  it('returns the hsb value for the keyword', () => {
    const color = keywordToHsb('sienna');
    expect(color).toEqual({
      hue: 19,
      saturation: 0.72,
      brightness: 0.63,
      alpha: 1,
    });
  });
});
