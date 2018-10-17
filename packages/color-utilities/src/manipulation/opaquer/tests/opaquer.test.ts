import opaquer from '../opaquer';

describe('opaquer', () => {
  it('returns the original color thats opaquer by the given amount', () => {
    const opaquerColor = opaquer(
      {red: 80, green: 5, blue: 50, alpha: 0.5},
      0.5,
    );
    expect(opaquerColor).toEqual({red: 80, green: 5, blue: 50, alpha: 1});
  });

  it('returns the original color when a opaquer value is not provided', () => {
    const opaquerColor = opaquer({red: 80, green: 5, blue: 50, alpha: 0.75});
    expect(opaquerColor).toEqual({red: 80, green: 5, blue: 50, alpha: 0.75});
  });
});
