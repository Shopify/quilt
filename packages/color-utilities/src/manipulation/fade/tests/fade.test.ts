import fade from '../fade';

describe('fade', () => {
  it('returns the original color if it`s a hex color', () => {
    const fadedColor = fade('#eee', -0.5);
    expect(fadedColor).toEqual('#eee');
  });

  it('returns the original color if it`s a keyword color', () => {
    const fadedColor = fade('green', -0.5);
    expect(fadedColor).toEqual('green');
  });

  it('returns the original color if it`s not recognised', () => {
    const fadedColor = fade('everviolet', -0.5);
    expect(fadedColor).toEqual('everviolet');
  });

  it('returns a color with alpha when it was not originally provided', () => {
    const fadedColor = fade({red: 80, green: 5, blue: 50});
    expect(fadedColor).toEqual({red: 80, green: 5, blue: 50, alpha: 1});
  });

  it('returns a color with a mutated alpha value', () => {
    const fadedColor = fade({red: 80, green: 5, blue: 50}, 0.5);
    expect(fadedColor).toEqual({red: 80, green: 5, blue: 50, alpha: 0.5});
  });

  it('will not return a color with alpha above 1', () => {
    const fadedColor = fade({red: 80, green: 5, blue: 50}, -100);
    expect(fadedColor).toEqual({red: 80, green: 5, blue: 50, alpha: 1});
  });

  it('will not return a color with alpha below 10', () => {
    const fadedColor = fade({red: 80, green: 5, blue: 50}, 100);
    expect(fadedColor).toEqual({red: 80, green: 5, blue: 50, alpha: 0});
  });
});
