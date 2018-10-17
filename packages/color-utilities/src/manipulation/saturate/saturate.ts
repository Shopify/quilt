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

function saturateColor(color: HSLColor | HSLAColor, saturateVal: number) {
  const {saturation} = color;
  const nextSaturation = saturation + saturateVal;
  return {
    ...color,
    saturation: clamp(nextSaturation, MIN_PERCENT, MAX_PERCENT),
  };
}

export default function saturate(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  saturateVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  return transformColorToColor(
    color,
    colorTypes.HSL,
    saturateColor,
    saturateVal,
  );
}
