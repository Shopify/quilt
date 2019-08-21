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
      }).toThrow();
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
      }).toThrow();
    });
  });
});
