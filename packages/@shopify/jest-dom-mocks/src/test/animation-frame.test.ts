import AnimationFrame from '../animation-frame';

describe('AnimationFrame', () => {
  describe('mock', () => {
    it('sets isMocked()', () => {
      const animationFrame = new AnimationFrame();
      animationFrame.mock();

      expect(animationFrame.isMocked()).toBe(true);
    });

    it('throws if it is already mocked', () => {
      const animationFrame = new AnimationFrame();

      animationFrame.mock();

      expect(() => {
        animationFrame.mock();
      }).toThrow();
    });
  });

  describe('restore', () => {
    it('sets isMocked', () => {
      const animationFrame = new AnimationFrame();
      animationFrame.mock();
      animationFrame.restore();

      expect(animationFrame.isMocked()).toBe(false);
    });

    it('throws if it has not yet been mocked', () => {
      const animationFrame = new AnimationFrame();

      expect(() => {
        animationFrame.restore();
      }).toThrow();
    });
  });
});
