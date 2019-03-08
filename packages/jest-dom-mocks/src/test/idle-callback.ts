import IdleCallback from '../idle-callback';

describe('IdleCallback', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const idleCallback = new IdleCallback();
      idleCallback.mock();

      expect(idleCallback.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const idleCallback = new IdleCallback();

      idleCallback.mock();

      expect(() => {
        idleCallback.mock();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const idleCallback = new IdleCallback();
      idleCallback.mock();
      idleCallback.restore();

      expect(idleCallback.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const idleCallback = new IdleCallback();

      expect(() => {
        idleCallback.restore();
      }).toThrow();
    });
  });
});
