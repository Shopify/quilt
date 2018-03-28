import Timer from '../timer';

describe('Timer', () => {
  describe('fake', () => {
    it('sets isUsingFakeTimer', () => {
      const timer = new Timer();
      timer.fake();

      expect(timer.isUsingFakeTimer).toBe(true);
    });

    it('throws if isUsingFakeTimer is true', () => {
      const timer = new Timer();
      timer.isUsingFakeTimer = true;
      expect(() => {
        timer.fake();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isUsingFakeTimer', () => {
      const timer = new Timer();
      timer.isUsingFakeTimer = true;
      timer.restore();

      expect(timer.isUsingFakeTimer).toBe(false);
    });

    it('throws if isUsingFakeTimer is false', () => {
      const timer = new Timer();
      timer.isUsingFakeTimer = false;
      expect(() => {
        timer.restore();
      }).toThrow();
    });
  });
});
