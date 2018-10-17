import {fade} from '@manipulation';

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

export default function opaquer(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  opaquerVal: number = DEFAULT_MANIPULAITION_VALUE,
) {
  return fade(color, -opaquerVal);
}
