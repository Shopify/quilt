import isHsl from '../isHsl';

describe('isHsl', () => {
  describe('non string or object data types', () => {
    it('returns false when the argument is of type boolean', () => {
      const booleanTest = isHsl(true);
      expect(booleanTest).toBe(false);
    });

    it('returns false when the argument is of type undefined', () => {
      const undefinedTest = isHsl(undefined);
      expect(undefinedTest).toBe(false);
    });

    it('returns false when the argument is of type number', () => {
      const numberTest = isHsl(5);
      expect(numberTest).toBe(false);
    });
  });

  describe('strings', () => {
    it('returns false when the argument does not contain hsl or hsla', () => {
      const isHslColor = isHsl('rgb(1,2,3)');
      expect(isHslColor).toBe(false);
    });

    it('returns false when the argument does not have matching parentheses', () => {
      const isHslColor = isHsl('hsla(1, 0.2, .3, .1');
      expect(isHslColor).toBe(false);
    });

    describe('hue', () => {
      it('returns false when hue is below 0', () => {
        const isHslColor = isHsl('hsla( -1, 0.2, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns false when hue is above 360', () => {
        const isHslColor = isHsl('hsla(361, 0.2, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns true when when hue is 0 or above', () => {
        const isHslColor = isHsl('hsla( 0, 0.2, .3, .1)');
        expect(isHslColor).toBe(true);
      });

      it('returns true when hue is 360 or below', () => {
        const isHslColor = isHsl('hsla(360, 0.2, .3, .1)');
        expect(isHslColor).toBe(true);
      });
    });

    describe('saturation', () => {
      it('returns false when saturation is below 0', () => {
        const isHslColor = isHsl('hsla(20, -0.2, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns false when saturation is above 100', () => {
        const isHslColor = isHsl('hsla(20, 100.1, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns true when when saturation is 0 or above', () => {
        const isHslColor = isHsl('hsla(20, 0, .3, .1)');
        expect(isHslColor).toBe(true);
      });

      it('returns true when saturation is 100 or below', () => {
        const isHslColor = isHsl('hsla(20, 100, .3, .1)');
        expect(isHslColor).toBe(true);
      });
    });

    describe('lightness', () => {
      it('returns false when lightness is below 0', () => {
        const isHslColor = isHsl('hsla(20, -0.2, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns false when lightness is above 100', () => {
        const isHslColor = isHsl('hsla(20, 100.1, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns true when when lightness is 0 or above', () => {
        const isHslColor = isHsl('hsla(20, 0, .3, .1)');
        expect(isHslColor).toBe(true);
      });

      it('returns true when lightness is 100 or below', () => {
        const isHslColor = isHsl('hsla(20, 100, .3, .1)');
        expect(isHslColor).toBe(true);
      });
    });

    describe('alpha', () => {
      it('returns false when the argument is an hsla color and does not have an alpha value', () => {
        const isHslColor = isHsl('hsla(1, 0.2, .3)');
        expect(isHslColor).toBe(false);
      });

      it('returns false when the argument is an hsl color and has an alpha value', () => {
        const isHslColor = isHsl('hsl(1, 0.2, .3, .1)');
        expect(isHslColor).toBe(false);
      });

      it('returns false when alpha is below 0', () => {
        const isHslColor = isHsl('hsla(20, 0.2, .3, -.1)');
        expect(isHslColor).toBe(false);
      });

      it('returns false when alpha is above 1', () => {
        const isHslColor = isHsl('hsla(20, 1, .3, 1.1)');
        expect(isHslColor).toBe(false);
      });

      it('returns true when when alpha is 0 or above', () => {
        const isHslColor = isHsl('hsla(20, 0, .3, 0)');
        expect(isHslColor).toBe(true);
      });

      it('returns true when alpha is 1 or below', () => {
        const isHslColor = isHsl('hsla(20, 1, .3, 1)');
        expect(isHslColor).toBe(true);
      });
    });
  });

  describe('objects', () => {
    it('returns false when the argument is of type null', () => {
      const nullTest = isHsl(null);
      expect(nullTest).toBe(false);
    });

    it('returns false when the argument has less than three keys', () => {
      const isHslColor = isHsl({
        hue: 200,
        saturation: 200,
      });
      expect(isHslColor).toBe(false);
    });

    it('returns false when the argument has more than four keys', () => {
      const isHslColor = isHsl({
        hue: 200,
        saturation: 200,
        brightnes: 200,
        lightness: 1,
        alpha: 0,
      });
      expect(isHslColor).toBe(false);
    });

    describe('hue', () => {
      it('returns false when hue is below 0', () => {
        const isHslColor = isHsl({hue: -1, saturation: 1, lightness: 0});
        expect(isHslColor).toBe(false);
      });

      it('returns false when hue is above 360', () => {
        const isHslColor = isHsl({hue: 361, saturation: 1, lightness: 0});
        expect(isHslColor).toBe(false);
      });

      it('returns true when when hue is 0 or above', () => {
        const isHslColor = isHsl({hue: 0, saturation: 1, lightness: 0});
        expect(isHslColor).toBe(true);
      });

      it('returns true when hue is 360 or below', () => {
        const isHslColor = isHsl({hue: 360, saturation: 1, lightness: 0});
        expect(isHslColor).toBe(true);
      });
    });

    describe('saturation', () => {
      it('returns false when saturation is below 0', () => {
        const isHslColor = isHsl({hue: 360, saturation: -1, lightness: 0});
        expect(isHslColor).toBe(false);
      });

      it('returns false when saturation is above 100', () => {
        const isHslColor = isHsl({hue: 360, saturation: 100.1, lightness: 0});
        expect(isHslColor).toBe(false);
      });

      it('returns true when when saturation is 0 or above', () => {
        const isHslColor = isHsl({hue: 360, saturation: 0, lightness: 0});
        expect(isHslColor).toBe(true);
      });

      it('returns true when saturation is 100 or below', () => {
        const isHslColor = isHsl({hue: 360, saturation: 100, lightness: 0});
        expect(isHslColor).toBe(true);
      });
    });

    describe('lightness', () => {
      it('returns false when lightness is below 0', () => {
        const isHslColor = isHsl({hue: 360, saturation: 1, lightness: -0.1});
        expect(isHslColor).toBe(false);
      });

      it('returns false when lightness is above 100', () => {
        const isHslColor = isHsl({hue: 360, saturation: 1, lightness: 100.1});
        expect(isHslColor).toBe(false);
      });

      it('returns true when when lightness is 0 or above', () => {
        const isHslColor = isHsl({hue: 360, saturation: 1, lightness: 0});
        expect(isHslColor).toBe(true);
      });

      it('returns true when lightness is 100 or below', () => {
        const isHslColor = isHsl({hue: 360, saturation: 1, lightness: 100});
        expect(isHslColor).toBe(true);
      });
    });

    describe('alpha', () => {
      it('returns false when the argument has four keys and does not have an alpha property', () => {
        const isHslColor = isHsl({
          hue: 200,
          saturation: 1,
          brightnes: 1,
          lightness: 1,
        });
        expect(isHslColor).toBe(false);
      });

      it('returns false when alpha is below 0', () => {
        const isHslColor = isHsl({
          hue: 360,
          saturation: 1,
          lightness: 0,
          alpha: -0.1,
        });
        expect(isHslColor).toBe(false);
      });

      it('returns false when alpha is above 1', () => {
        const isHslColor = isHsl({
          hue: 360,
          saturation: 1,
          lightness: 0,
          alpha: 1.1,
        });
        expect(isHslColor).toBe(false);
      });

      it('returns true when when alpha is 0 or above', () => {
        const isHslColor = isHsl({
          hue: 360,
          saturation: 1,
          lightness: 0,
          alpha: 0,
        });
        expect(isHslColor).toBe(true);
      });

      it('returns true when alpha is 1 or below', () => {
        const isHslColor = isHsl({
          hue: 360,
          saturation: 1,
          lightness: 0,
          alpha: 1,
        });
        expect(isHslColor).toBe(true);
      });
    });
  });
});
