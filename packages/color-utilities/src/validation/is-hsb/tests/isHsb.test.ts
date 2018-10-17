import isHsb from '../isHsb';

describe('isHsb', () => {
  describe('non string or object data types', () => {
    it('returns false when the argument is of type boolean', () => {
      const booleanTest = isHsb(true);
      expect(booleanTest).toBe(false);
    });

    it('returns false when the argument is of type undefined', () => {
      const undefinedTest = isHsb(undefined);
      expect(undefinedTest).toBe(false);
    });

    it('returns false when the argument is of type number', () => {
      const numberTest = isHsb(5);
      expect(numberTest).toBe(false);
    });
  });

  describe('strings', () => {
    it('returns false when the argument does not contain hsb or hsba', () => {
      const isHsbColor = isHsb('rgb(1,2,3)');
      expect(isHsbColor).toBe(false);
    });

    it('returns false when the argument does not have matching parentheses', () => {
      const isHsbColor = isHsb('hsba(1, 0.2, .3, .1');
      expect(isHsbColor).toBe(false);
    });

    describe('hue', () => {
      it('returns false when hue is below 0', () => {
        const isHsbColor = isHsb('hsba( -1, 0.2, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns false when hue is above 360', () => {
        const isHsbColor = isHsb('hsba(361, 0.2, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when hue is 0 or above', () => {
        const isHsbColor = isHsb('hsba( 0, 0.2, .3, .1)');
        expect(isHsbColor).toBe(true);
      });

      it('returns true when hue is 360 or below', () => {
        const isHsbColor = isHsb('hsba(360, 0.2, .3, .1)');
        expect(isHsbColor).toBe(true);
      });
    });

    describe('saturation', () => {
      it('returns false when saturation is below 0', () => {
        const isHsbColor = isHsb('hsba(20, -0.2, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns false when saturation is above 1', () => {
        const isHsbColor = isHsb('hsba(20, 1.1, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when saturation is 0 or above', () => {
        const isHsbColor = isHsb('hsba(20, 0, .3, .1)');
        expect(isHsbColor).toBe(true);
      });

      it('returns true when saturation is 1 or below', () => {
        const isHsbColor = isHsb('hsba(20, 1, .3, .1)');
        expect(isHsbColor).toBe(true);
      });
    });

    describe('brightness', () => {
      it('returns false when brightness is below 0', () => {
        const isHsbColor = isHsb('hsba(20, -0.2, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns false when brightness is above 1', () => {
        const isHsbColor = isHsb('hsba(20, 1.1, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when brightness is 0 or above', () => {
        const isHsbColor = isHsb('hsba(20, 0, .3, .1)');
        expect(isHsbColor).toBe(true);
      });

      it('returns true when brightness is 1 or below', () => {
        const isHsbColor = isHsb('hsba(20, 1, .3, .1)');
        expect(isHsbColor).toBe(true);
      });
    });

    describe('alpha', () => {
      it('returns false when the argument is an hsba color and does not have an alpha value', () => {
        const isHsbColor = isHsb('hsba(1, 0.2, .3)');
        expect(isHsbColor).toBe(false);
      });

      it('returns false when the argument is an hsb color and has an alpha value', () => {
        const isHsbColor = isHsb('hsb(1, 0.2, .3, .1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns false when alpha is below 0', () => {
        const isHsbColor = isHsb('hsba(20, 0.2, .3, -.1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns false when alpha is above 1', () => {
        const isHsbColor = isHsb('hsba(20, 1, .3, 1.1)');
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when alpha is 0 or above', () => {
        const isHsbColor = isHsb('hsba(20, 0, .3, 0)');
        expect(isHsbColor).toBe(true);
      });

      it('returns true when alpha is 1 or below', () => {
        const isHsbColor = isHsb('hsba(20, 1, .3, 1)');
        expect(isHsbColor).toBe(true);
      });
    });
  });

  describe('objects', () => {
    it('returns false when the argument is of type null', () => {
      const nullTest = isHsb(null);
      expect(nullTest).toBe(false);
    });

    it('returns false when the argument has less than three keys', () => {
      const isHsbColor = isHsb({
        hue: 200,
        saturation: 200,
      });
      expect(isHsbColor).toBe(false);
    });

    it('returns false when the argument has more than four keys', () => {
      const isHsbColor = isHsb({
        hue: 200,
        saturation: 200,
        brightnes: 200,
        brightness: 1,
        alpha: 0,
      });
      expect(isHsbColor).toBe(false);
    });

    describe('hue', () => {
      it('returns false when hue is below 0', () => {
        const isHsbColor = isHsb({hue: -1, saturation: 1, brightness: 0});
        expect(isHsbColor).toBe(false);
      });

      it('returns false when hue is above 360', () => {
        const isHsbColor = isHsb({hue: 361, saturation: 1, brightness: 0});
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when hue is 0 or above', () => {
        const isHsbColor = isHsb({hue: 0, saturation: 1, brightness: 0});
        expect(isHsbColor).toBe(true);
      });

      it('returns true when hue is 360 or below', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1, brightness: 0});
        expect(isHsbColor).toBe(true);
      });
    });

    describe('saturation', () => {
      it('returns false when saturation is below 0', () => {
        const isHsbColor = isHsb({hue: 360, saturation: -1, brightness: 0});
        expect(isHsbColor).toBe(false);
      });

      it('returns false when saturation is above 1', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1.1, brightness: 0});
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when saturation is 0 or above', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 0, brightness: 0});
        expect(isHsbColor).toBe(true);
      });

      it('returns true when saturation is 1 or below', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1, brightness: 0});
        expect(isHsbColor).toBe(true);
      });
    });

    describe('brightness', () => {
      it('returns false when brightness is below 0', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1, brightness: -0.1});
        expect(isHsbColor).toBe(false);
      });

      it('returns false when brightness is above 1', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1, brightness: 1.1});
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when brightness is 0 or above', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1, brightness: 0});
        expect(isHsbColor).toBe(true);
      });

      it('returns true when brightness is 1 or below', () => {
        const isHsbColor = isHsb({hue: 360, saturation: 1, brightness: 1});
        expect(isHsbColor).toBe(true);
      });
    });

    describe('alpha', () => {
      it('returns false when the argument has four keys and does not have an alpha property', () => {
        const isHsbColor = isHsb({
          hue: 200,
          saturation: 1,
          brightnes: 1,
          brightness: 1,
        });
        expect(isHsbColor).toBe(false);
      });

      it('returns false when alpha is below 0', () => {
        const isHsbColor = isHsb({
          hue: 360,
          saturation: 1,
          brightness: 0,
          alpha: -0.1,
        });
        expect(isHsbColor).toBe(false);
      });

      it('returns false when alpha is above 1', () => {
        const isHsbColor = isHsb({
          hue: 360,
          saturation: 1,
          brightness: 0,
          alpha: 1.1,
        });
        expect(isHsbColor).toBe(false);
      });

      it('returns true when when alpha is 0 or above', () => {
        const isHsbColor = isHsb({
          hue: 360,
          saturation: 1,
          brightness: 0,
          alpha: 0,
        });
        expect(isHsbColor).toBe(true);
      });

      it('returns true when alpha is 1 or below', () => {
        const isHsbColor = isHsb({
          hue: 360,
          saturation: 1,
          brightness: 0,
          alpha: 1,
        });
        expect(isHsbColor).toBe(true);
      });
    });
  });
});
