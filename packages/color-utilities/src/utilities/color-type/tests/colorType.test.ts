import colorType from '../colorType';
import {colorTypes} from '@types';

describe('colorType', () => {
  describe('string', () => {
    it('returns hex for hex colors', () => {
      const color = colorType('#eee');
      expect(color).toBe(colorTypes.HEX);
    });

    it('returns rgb for rgb colors', () => {
      const color = colorType('rgb(0,0,0)');
      expect(color).toBe(colorTypes.RGB);
    });

    it('returns rgba for rgba colors', () => {
      const color = colorType('rgba(0,0,0,0)');
      expect(color).toBe(colorTypes.RGBA);
    });

    it('returns hsl for hsl colors', () => {
      const color = colorType('hsl(0,0%,0%)');
      expect(color).toBe(colorTypes.HSL);
    });

    it('returns hsla for hsla colors', () => {
      const color = colorType('hsla(0,0%,0%,0)');
      expect(color).toBe(colorTypes.HSLA);
    });

    it('returns hsb for hsb colors', () => {
      const color = colorType('hsb(0,0,0)');
      expect(color).toBe(colorTypes.HSB);
    });

    it('returns hsba for hsba colors', () => {
      const color = colorType('hsba(0,0,0,0)');
      expect(color).toBe(colorTypes.HSBA);
    });

    it('returns keyword for keywords', () => {
      const color = colorType('papayawhip');
      expect(color).toBe(colorTypes.KEYWORD);
    });

    it('returns default when the color is not recognised', () => {
      const color = colorType('');
      expect(color).toBe(colorTypes.DEFAULT);
    });
  });

  describe('object', () => {
    it('returns rgb for rgb colors', () => {
      const color = colorType({red: 0, green: 0, blue: 0});
      expect(color).toBe(colorTypes.RGB);
    });

    it('returns rgba for rgba colors', () => {
      const color = colorType({red: 0, green: 0, blue: 0, alpha: 0});
      expect(color).toBe(colorTypes.RGBA);
    });

    it('returns hsl for hsl colors', () => {
      const color = colorType({hue: 0, saturation: 0, lightness: 0});
      expect(color).toBe(colorTypes.HSL);
    });

    it('returns hsla for hsla colors', () => {
      const color = colorType({
        hue: 0,
        saturation: 0,
        lightness: 0,
        alpha: 0,
      });
      expect(color).toBe(colorTypes.HSLA);
    });

    it('returns hsb for hsb colors', () => {
      const color = colorType({hue: 0, saturation: 0, brightness: 0});
      expect(color).toBe(colorTypes.HSB);
    });

    it('returns hsba for hsba colors', () => {
      const color = colorType({
        hue: 0,
        saturation: 0,
        brightness: 0,
        alpha: 0,
      });
      expect(color).toBe(colorTypes.HSBA);
    });

    it('returns default when the color is not recognised', () => {
      const color = colorType({} as any);
      expect(color).toBe(colorTypes.DEFAULT);
    });
  });
});
