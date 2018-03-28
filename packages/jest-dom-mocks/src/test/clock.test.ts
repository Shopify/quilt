import Clock from '../clock';

describe('Clock', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const clock = new Clock();
      clock.mock();

      expect(clock.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const clock = new Clock();

      clock.mock();

      expect(() => {
        clock.mock();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const clock = new Clock();
      clock.mock();
      clock.restore();

      expect(clock.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const clock = new Clock();

      expect(() => {
        clock.restore();
      }).toThrow();
    });
  });
});
