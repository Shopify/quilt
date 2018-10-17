import {clamp, transformColorToColor} from '@utilities';

import {
  MIN_PERCENT,
  MAX_PERCENT,
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

function darkenColor(color: HSLColor | HSLAColor, darken: number) {
  const {lightness} = color;
  const nextLightness = lightness - darken;
  return {
    ...color,
    lightness: clamp(nextLightness, MIN_PERCENT, MAX_PERCENT),
  };
}

export default function darken(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  darkenVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  return transformColorToColor(color, colorTypes.HSL, darkenColor, darkenVal);
}
