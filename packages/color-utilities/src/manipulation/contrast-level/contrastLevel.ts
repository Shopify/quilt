import {contrast} from '@manipulation';

import {AAA, AA} from '@src/constants';
import {
  HSLColor,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
  wcagLevel,
} from '@types';

export default function contrastLevel(
  colorA:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
  colorB:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
) {
  const contrastRatio = contrast(colorA, colorB);

  return contrastRatio >= AAA
    ? wcagLevel.AAA
    : contrastRatio >= AA
      ? wcagLevel.AA
      : wcagLevel.A;
}
