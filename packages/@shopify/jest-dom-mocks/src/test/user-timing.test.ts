import UserTiming from '../user-timing';

describe('UserTiming', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const userTiming = new UserTiming();
      userTiming.mock();

      expect(userTiming.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const userTiming = new UserTiming();
      userTiming.mock();

      expect(() => {
        userTiming.mock();
      }).toThrow();
    });

    it('delegates stubbed options to window.performance.timing', () => {
      const userTiming = new UserTiming();
      const mockRequestStart = 123;
      const mockResponseEnd = 456;

      userTiming.mock({
        requestStart: mockRequestStart,
        responseEnd: mockResponseEnd,
      });

      expect(window.performance.timing.requestStart).toBe(mockRequestStart);
      expect(window.performance.timing.responseEnd).toBe(mockResponseEnd);
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const userTiming = new UserTiming();
      userTiming.mock();
      userTiming.restore();

      expect(userTiming.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const userTiming = new UserTiming();

      expect(() => {
        userTiming.restore();
      }).toThrow();
    });
  });
});
