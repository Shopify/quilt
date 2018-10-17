import {colorToRgb} from '@transforms';

import {MAX_RGB, BASE_DECIMAL_POINTS} from '@constants';
import {
  HSLColor,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
} from '@types';

const BENCH_MARK = 0.03928;
const RC = 0.2126;
const GC = 0.7152;
const BC = 0.0722;
const LC = 12.92;

const NO = 0.055;
const NT = 1.055;
const P = 2.4;

function normalizeColor(color: number) {
  return color <= BENCH_MARK ? color / LC : ((color + NO) / NT) ** P;
}

export default function luminosity(
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
  const {red, green, blue} = colorToRgb(color);
  const rsrgb = red / MAX_RGB;
  const gsrgb = green / MAX_RGB;
  const bsrgb = blue / MAX_RGB;

  const r = normalizeColor(rsrgb);
  const g = normalizeColor(gsrgb);
  const b = normalizeColor(bsrgb);

  return parseFloat((RC * r + GC * g + BC * b).toFixed(BASE_DECIMAL_POINTS));
}
