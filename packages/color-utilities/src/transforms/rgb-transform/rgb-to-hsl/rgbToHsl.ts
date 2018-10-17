import {rgbToHsbl} from '@utilities';

import {MAX_PERCENT} from '@src/constants';
import {RGBColor, RGBAColor, HSLColor, HSLAColor} from '@types';

function rgbToHsl(color: RGBColor): HSLColor;
function rgbToHsl(color: RGBAColor): HSLAColor;
function rgbToHsl(color: RGBAColor): HSLAColor {
  const {
    hue,
    saturation: rawSaturation,
    lightness: rawLightness,
    alpha,
  } = rgbToHsbl(color);
  const saturation = rawSaturation * MAX_PERCENT;
  const lightness = rawLightness * MAX_PERCENT;
  return {hue, saturation, lightness, alpha};
}

export default rgbToHsl;
