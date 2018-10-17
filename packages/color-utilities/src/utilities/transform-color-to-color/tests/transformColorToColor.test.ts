import transformColorToColor from '../transformColorToColor';
import {colorTypes} from '@types';

describe('transformColorToColor', () => {
  it('returns the given color if an unknown string is provided', () => {
    const newColor = transformColorToColor(
      'not a color',
      colorTypes.RGB,
      () => {},
    );
    expect(newColor).toBe('not a color');
  });

  it('returns given color if the color type is default', () => {
    const color: any = {};
    const newColor = transformColorToColor(color, colorTypes.RGB, () => {});
    expect(newColor).toBe(color);
  });

  it('calls the action with provided arguments', () => {
    const spy = jest.fn();
    transformColorToColor('#eee', colorTypes.RGB, spy, 34);
    expect(spy).toHaveBeenCalledWith({red: 238, green: 238, blue: 238}, 34);
  });

  it('returns undefiend when a color is not returned from the given action', () => {
    const newColor = transformColorToColor(
      '#eee',
      colorTypes.RGB,
      () => {},
      34,
    );
    expect(newColor).toBeUndefined();
  });

  it('returns the given color when the ideal color is keyword', () => {
    const newColor = transformColorToColor(
      '#eee',
      colorTypes.KEYWORD,
      () => {},
    );
    expect(newColor).toBe('#eee');
  });

  describe('idealColor', () => {
    it('transforms a hex color', () => {
      const newColor = transformColorToColor('#ededed', colorTypes.HEX, c => c);
      expect(newColor).toBe('#ededed');
    });

    it('transforms a rgb color', () => {
      const newColor = transformColorToColor('#ededed', colorTypes.RGB, c => c);
      expect(newColor).toBe('#ededed');
    });

    it('transforms a hsl color', () => {
      const newColor = transformColorToColor('#ededed', colorTypes.HSL, c => c);
      expect(newColor).toBe('#ededed');
    });

    it('transforms a hsb color', () => {
      const newColor = transformColorToColor('#ededed', colorTypes.HSB, c => c);
      expect(newColor).toBe('#ededed');
    });
  });

  describe('returns original color', () => {
    it('returns the original hex color', () => {
      const newColor = transformColorToColor('#ededed', colorTypes.HEX, c => c);
      expect(newColor).toBe('#ededed');
    });

    it('returns the original rgb color', () => {
      const newColor = transformColorToColor(
        {red: 238, green: 238, blue: 238},
        colorTypes.RGB,
        c => c,
      );
      expect(newColor).toEqual({red: 238, green: 238, blue: 238});
    });

    it('returns the original hsl color', () => {
      const newColor = transformColorToColor(
        {hue: 0, saturation: 0, lightness: 93},
        colorTypes.HSL,
        c => c,
      );
      expect(newColor).toEqual({hue: 0, saturation: 0, lightness: 93});
    });

    it('returns the original hsb color', () => {
      const newColor = transformColorToColor(
        {hue: 0, saturation: 0, brightness: 93},
        colorTypes.HSB,
        c => c,
      );
      expect(newColor).toEqual({hue: 0, saturation: 0, brightness: 93});
    });
  });
});
