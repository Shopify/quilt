import Location from '../location';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Location', () => {
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
      }).toThrow(
        'You tried to mock window.location when it was already mocked.',
      );
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
      }).toThrow(
        'You tried to restore window.location when it was already restored.',
      );
    });
  });
});
