import isRgb from '../isRgb';

describe('isRgb', () => {
  describe('non string or object data types', () => {
    it('returns false when the argument is of type boolean', () => {
      const booleanTest = isRgb(true);
      expect(booleanTest).toBe(false);
    });

    it('returns false when the argument is of type undefined', () => {
      const undefinedTest = isRgb(undefined);
      expect(undefinedTest).toBe(false);
    });

    it('returns false when the argument is of type number', () => {
      const numberTest = isRgb(5);
      expect(numberTest).toBe(false);
    });
  });

  describe('strings', () => {
    it('returns false when the argument does not contain rgb or rgba', () => {
      const isRgbColor = isRgb('rg(1,2,3)');
      expect(isRgbColor).toBe(false);
    });

    it('returns false when the argument does not have matching parentheses', () => {
      const isRgbColor = isRgb('rgba(1, 0.2, .3, .1');
      expect(isRgbColor).toBe(false);
    });

    describe('red', () => {
      it('returns false when red is below 0', () => {
        const isRgbColor = isRgb('rgba( -1, 0.2, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns false when red is above 255', () => {
        const isRgbColor = isRgb('rgba(256, 0.2, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when red is 0 or above', () => {
        const isRgbColor = isRgb('rgba( 0, 0.2, .3, .1)');
        expect(isRgbColor).toBe(true);
      });

      it('returns true when red is 255 or below', () => {
        const isRgbColor = isRgb('rgba(255, 0.2, .3, .1)');
        expect(isRgbColor).toBe(true);
      });
    });

    describe('green', () => {
      it('returns false when green is below 0', () => {
        const isRgbColor = isRgb('rgba(20, -0.2, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns false when green is above 255', () => {
        const isRgbColor = isRgb('rgba(20, 255.1, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when green is 0 or above', () => {
        const isRgbColor = isRgb('rgba(20, 0, .3, .1)');
        expect(isRgbColor).toBe(true);
      });

      it('returns true when green is 255 or below', () => {
        const isRgbColor = isRgb('rgba(20, 255, .3, .1)');
        expect(isRgbColor).toBe(true);
      });
    });

    describe('blue', () => {
      it('returns false when blue is below 0', () => {
        const isRgbColor = isRgb('rgba(20, -0.2, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns false when blue is above 255', () => {
        const isRgbColor = isRgb('rgba(20, 255.1, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when blue is 0 or above', () => {
        const isRgbColor = isRgb('rgba(20, 0, .3, .1)');
        expect(isRgbColor).toBe(true);
      });

      it('returns true when blue is 255 or below', () => {
        const isRgbColor = isRgb('rgba(20, 255, .3, .1)');
        expect(isRgbColor).toBe(true);
      });
    });

    describe('alpha', () => {
      it('returns false when the argument is an rgba color and does not have an alpha value', () => {
        const isRgbColor = isRgb('rgba(1, 0.2, .3)');
        expect(isRgbColor).toBe(false);
      });

      it('returns false when the argument is an rgb color and has an alpha value', () => {
        const isRgbColor = isRgb('rgb(1, 0.2, .3, .1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns false when alpha is below 0', () => {
        const isRgbColor = isRgb('rgba(20, 0.2, .3, -.1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns false when alpha is above 1', () => {
        const isRgbColor = isRgb('rgba(20, 1, .3, 1.1)');
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when alpha is 0 or above', () => {
        const isRgbColor = isRgb('rgba(20, 0, .3, 0)');
        expect(isRgbColor).toBe(true);
      });

      it('returns true when alpha is 1 or below', () => {
        const isRgbColor = isRgb('rgba(20, 1, .3, 1)');
        expect(isRgbColor).toBe(true);
      });
    });
  });

  describe('objects', () => {
    it('returns false when the argument is of type null', () => {
      const nullTest = isRgb(null);
      expect(nullTest).toBe(false);
    });

    it('returns false when the argument has less than three keys', () => {
      const isRgbColor = isRgb({
        red: 200,
        green: 200,
      });
      expect(isRgbColor).toBe(false);
    });

    it('returns false when the argument has more than four keys', () => {
      const isRgbColor = isRgb({
        red: 200,
        green: 200,
        brightnes: 200,
        blue: 1,
        alpha: 0,
      });
      expect(isRgbColor).toBe(false);
    });

    describe('red', () => {
      it('returns false when red is below 0', () => {
        const isRgbColor = isRgb({red: -1, green: 1, blue: 0});
        expect(isRgbColor).toBe(false);
      });

      it('returns false when red is above 255', () => {
        const isRgbColor = isRgb({red: 256, green: 1, blue: 0});
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when red is 0 or above', () => {
        const isRgbColor = isRgb({red: 0, green: 1, blue: 0});
        expect(isRgbColor).toBe(true);
      });

      it('returns true when red is 255 or below', () => {
        const isRgbColor = isRgb({red: 255, green: 1, blue: 0});
        expect(isRgbColor).toBe(true);
      });
    });

    describe('green', () => {
      it('returns false when green is below 0', () => {
        const isRgbColor = isRgb({red: 234, green: -1, blue: 0});
        expect(isRgbColor).toBe(false);
      });

      it('returns false when green is above 255', () => {
        const isRgbColor = isRgb({red: 234, green: 255.1, blue: 0});
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when green is 0 or above', () => {
        const isRgbColor = isRgb({red: 234, green: 0, blue: 0});
        expect(isRgbColor).toBe(true);
      });

      it('returns true when green is 255 or below', () => {
        const isRgbColor = isRgb({red: 234, green: 255, blue: 0});
        expect(isRgbColor).toBe(true);
      });
    });

    describe('blue', () => {
      it('returns false when blue is below 0', () => {
        const isRgbColor = isRgb({red: 234, green: 1, blue: -0.1});
        expect(isRgbColor).toBe(false);
      });

      it('returns false when blue is above 255', () => {
        const isRgbColor = isRgb({red: 234, green: 1, blue: 255.1});
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when blue is 0 or above', () => {
        const isRgbColor = isRgb({red: 234, green: 1, blue: 0});
        expect(isRgbColor).toBe(true);
      });

      it('returns true when blue is 255 or below', () => {
        const isRgbColor = isRgb({red: 234, green: 1, blue: 255});
        expect(isRgbColor).toBe(true);
      });
    });

    describe('alpha', () => {
      it('returns false when the argument has four keys and does not have an alpha property', () => {
        const isRgbColor = isRgb({
          red: 200,
          green: 200,
          brightnes: 200,
          blue: 1,
        });
        expect(isRgbColor).toBe(false);
      });

      it('returns false when alpha is below 0', () => {
        const isRgbColor = isRgb({
          red: 234,
          green: 1,
          blue: 0,
          alpha: -0.1,
        });
        expect(isRgbColor).toBe(false);
      });

      it('returns false when alpha is above 1', () => {
        const isRgbColor = isRgb({
          red: 234,
          green: 1,
          blue: 0,
          alpha: 1.1,
        });
        expect(isRgbColor).toBe(false);
      });

      it('returns true when when alpha is 0 or above', () => {
        const isRgbColor = isRgb({
          red: 234,
          green: 1,
          blue: 0,
          alpha: 0,
        });
        expect(isRgbColor).toBe(true);
      });

      it('returns true when alpha is 1 or below', () => {
        const isRgbColor = isRgb({
          red: 234,
          green: 1,
          blue: 0,
          alpha: 1,
        });
        expect(isRgbColor).toBe(true);
      });
    });
  });
});
