import {rgbFromHueAndChroma} from '@utilities';

import {MAX_RGB, MAX_ALPHA} from '@constants';
import {HSBColor, HSBAColor, RGBColor, RGBAColor} from '@types';

function hsbToRgb(color: HSBColor): RGBColor;
function hsbToRgb(color: HSBAColor): RGBAColor;
function hsbToRgb(color: HSBAColor): RGBAColor {
  const {hue, saturation, brightness, alpha = MAX_ALPHA} = color;
  const chroma = brightness * saturation;

  let {red, green, blue} = rgbFromHueAndChroma(hue, chroma);

  const chromaBrightnessDelta = brightness - chroma;
  red += chromaBrightnessDelta;
  green += chromaBrightnessDelta;
  blue += chromaBrightnessDelta;

  return {
    red: Math.round(red * MAX_RGB),
    green: Math.round(green * MAX_RGB),
    blue: Math.round(blue * MAX_RGB),
    alpha,
  };
}

export default hsbToRgb;
