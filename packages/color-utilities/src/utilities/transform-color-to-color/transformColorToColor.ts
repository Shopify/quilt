import {colorToHsl, colorToHex, colorToRgb, colorToHsb} from '@transforms';
import {colorType} from '@utilities';
import {isHex, isKeyword} from '@validation';

import {STRING} from '@constants';
import {
  HSLColor,
  colorTypes,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
} from '@types';

export default function transformColorToColor(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  idealColor: colorTypes,
  action: Function,
  ...args: any[]
) {
  if (
    typeof color === STRING &&
    !isHex(color as string) &&
    !isKeyword(color as string)
  ) {
    return color;
  }

  const type = colorType(color);
  if (type === colorTypes.DEFAULT) {
    return color;
  }

  let currentColor;
  switch (idealColor) {
    case colorTypes.HEX:
      currentColor = colorToHex(color);
      break;
    case colorTypes.RGB:
    case colorTypes.RGBA:
      currentColor = colorToRgb(color);
      break;
    case colorTypes.HSL:
    case colorTypes.HSLA:
      currentColor = colorToHsl(color);
      break;
    case colorTypes.HSB:
    case colorTypes.HSBA:
      currentColor = colorToHsb(color);
      break;
    case colorTypes.KEYWORD:
    default:
  }

  // Keywords can't be transformed
  if (!currentColor) {
    return color;
  }

  const newColor = action(currentColor, ...args);

  // color was not returned from action
  if (!newColor) {
    return;
  }

  switch (type) {
    case colorTypes.RGB:
    case colorTypes.RGBA:
      return colorToRgb(newColor);
    case colorTypes.HSB:
    case colorTypes.HSBA:
      return colorToHsb(newColor);
    case colorTypes.HEX:
      return colorToHex(newColor);
    case colorTypes.HSL:
    case colorTypes.HSLA:
      return colorToHsl(newColor);
  }
}
