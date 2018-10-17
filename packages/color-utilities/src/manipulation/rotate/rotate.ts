import {clamp, transformColorToColor} from '@utilities';

import {MAX_HUE, MIN_HUE, DEFAULT_MANIPULAITION_VALUE} from '@src/constants';
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

function rotateColor(color: HSLColor | HSLAColor, rotateVal: number) {
  const {hue} = color;
  const nextHue = hue + rotateVal;
  return {...color, hue: clamp(nextHue, MIN_HUE, MAX_HUE)};
}

export default function rotate(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  rotateVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  return transformColorToColor(color, colorTypes.HSL, rotateColor, rotateVal);
}
