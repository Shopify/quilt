import luminosity from '../luminosity';

describe('luminosity', () => {
  it('returns the luminosity of the provided color', () => {
    const luminosityOfColor = luminosity({red: 10, green: 134, blue: 121});
    expect(luminosityOfColor).toEqual(0.18);
  });
});
