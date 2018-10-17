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

function lightenColor(color: HSLColor | HSLAColor, lightenVal: number) {
  const {lightness} = color;
  const nextLightness = lightness + lightenVal;
  return {
    ...color,
    lightness: clamp(nextLightness, MIN_PERCENT, MAX_PERCENT),
  };
}

export default function lighten(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  lightenVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  return transformColorToColor(color, colorTypes.HSL, lightenColor, lightenVal);
}
