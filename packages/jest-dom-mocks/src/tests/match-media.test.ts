import MatchMedia from '../match-media';

describe('MatchMedia', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const matchMedia = new MatchMedia();
      matchMedia.mock();

      expect(matchMedia.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const matchMedia = new MatchMedia();

      matchMedia.mock();

      expect(() => {
        matchMedia.mock();
      }).toThrow(
        'You tried to mock window.matchMedia when it was already mocked.',
      );
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const matchMedia = new MatchMedia();
      matchMedia.mock();
      matchMedia.restore();

      expect(matchMedia.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const matchMedia = new MatchMedia();

      expect(() => {
        matchMedia.restore();
      }).toThrow(
        'You tried to restore window.matchMedia when it was already restored.',
      );
    });
  });
});
