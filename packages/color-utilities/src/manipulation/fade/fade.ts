import {clamp, colorType, transformColorToColor} from '@utilities';

import {
  MIN_ALPHA,
  MAX_ALPHA,
  DEFAULT_MANIPULAITION_VALUE,
} from '@src/constants';
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

function fadeColor(color: RGBAColor, fadeVal: number) {
  const {alpha = MAX_ALPHA} = color;
  const nextAlpha = alpha - fadeVal;
  return {...color, alpha: clamp(nextAlpha, MIN_ALPHA, MAX_ALPHA)};
}

export default function fade(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  fadeVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  const type = colorType(color);
  if (
    type === colorTypes.DEFAULT ||
    type === colorTypes.HEX ||
    type === colorTypes.KEYWORD
  ) {
    return color;
  }

  return transformColorToColor(color, colorTypes.RGBA, fadeColor, fadeVal);
}
