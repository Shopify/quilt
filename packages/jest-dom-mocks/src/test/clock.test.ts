import Clock from '../clock';

describe('Clock', () => {
  describe('fake', () => {
    it('sets isUsingFakeClock', () => {
      const clock = new Clock();
      clock.fake();

      expect(clock.isUsingFakeClock).toBe(true);
    });

    it('throws if isUsingFakeClock is true', () => {
      const clock = new Clock();
      clock.isUsingFakeClock = true;
      expect(() => {
        clock.fake();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isUsingFakeClock', () => {
      const clock = new Clock();
      clock.isUsingFakeClock = true;
      clock.restore();

      expect(clock.isUsingFakeClock).toBe(false);
    });

    it('throws if isUsingFakeClock is false', () => {
      const clock = new Clock();
      clock.isUsingFakeClock = false;
      expect(() => {
        clock.restore();
      }).toThrow();
    });
  });
});
