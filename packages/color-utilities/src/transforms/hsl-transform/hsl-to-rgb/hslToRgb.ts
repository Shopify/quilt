import {rgbFromHueAndChroma} from '@utilities';

import {MAX_RGB, MAX_PERCENT, MAX_ALPHA} from '@constants';
import {HSLColor, HSLAColor, RGBColor, RGBAColor} from '@types';

function hslToRgb(color: HSLColor): RGBColor;
function hslToRgb(color: HSLAColor): RGBAColor;
function hslToRgb(color: HSLAColor): RGBAColor {
  const {hue, saturation, lightness, alpha = MAX_ALPHA} = color;
  const chroma =
    (1 - Math.abs(2 * (lightness / MAX_PERCENT) - 1)) *
    (saturation / MAX_PERCENT);

  let {red, green, blue} = rgbFromHueAndChroma(hue, chroma);

  const lightnessVal = lightness / MAX_PERCENT - chroma / 2;
  red += lightnessVal;
  green += lightnessVal;
  blue += lightnessVal;

  return {
    red: Math.round(red * MAX_RGB),
    green: Math.round(green * MAX_RGB),
    blue: Math.round(blue * MAX_RGB),
    alpha,
  };
}

export default hslToRgb;
