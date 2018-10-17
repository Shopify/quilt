import {luminosity} from '@manipulation';

import {BASE_DECIMAL_POINTS} from '@src/constants';
import {
  HSLColor,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
} from '@types';

const VAL = 0.05;

export default function contrast(
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
  const luminosityA = luminosity(colorA);
  const luminosityB = luminosity(colorB);
  const contrastValue =
    luminosityA > luminosityB
      ? (luminosityA + VAL) / (luminosityB + VAL)
      : (luminosityB + VAL) / (luminosityA + VAL);

  return parseFloat(contrastValue.toFixed(BASE_DECIMAL_POINTS));
}
