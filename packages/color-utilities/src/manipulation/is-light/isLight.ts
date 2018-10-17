import {colorToRgb} from '@transforms';
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

const RV = 299;
const GV = 587;
const BV = 114;
const DIVISOR = 1000;
const CV = 125;

export default function isLight(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
) {
  if (
    typeof color === STRING &&
    !isHex(color as string) &&
    !isKeyword(color as string)
  ) {
    return;
  }

  const type = colorType(color);
  if (type === colorTypes.DEFAULT) {
    return;
  }

  const {red, green, blue} = colorToRgb(color);
  const contrast = (red * RV + green * GV + blue * BV) / DIVISOR;
  return contrast > CV;
}
