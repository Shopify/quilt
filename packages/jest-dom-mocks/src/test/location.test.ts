import Location from '../location';

describe('Location', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const location = new Location();
      location.mock();

      expect(location.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const location = new Location();

      location.mock();

      expect(() => {
        location.mock();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const location = new Location();
      location.mock();
      location.restore();

      expect(location.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const location = new Location();

      expect(() => {
        location.restore();
      }).toThrow();
    });
  });
});
