import Timer from '../timer';

describe('Timer', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const timer = new Timer();
      timer.mock();

      expect(timer.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const timer = new Timer();

      timer.mock();

      expect(() => {
        timer.mock();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const timer = new Timer();
      timer.mock();
      timer.restore();

      expect(timer.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const timer = new Timer();

      expect(() => {
        timer.restore();
      }).toThrow();
    });
  });
});
