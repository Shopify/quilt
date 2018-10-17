import {saturate} from '@manipulation';

import {DEFAULT_MANIPULAITION_VALUE} from '@src/constants';
import {
  HSLColor,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
} from '@types';

export default function desaturate(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  desaturateVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  return saturate(color, -desaturateVal);
}
