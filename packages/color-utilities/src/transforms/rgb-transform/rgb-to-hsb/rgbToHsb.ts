import {rgbToHsbl} from '@utilities';

import {RGBColor, RGBAColor, HSBColor, HSBAColor} from '@types';

function rgbToHsb(color: RGBColor): HSBColor;
function rgbToHsb(color: RGBAColor): HSBAColor;
function rgbToHsb(color: RGBAColor): HSBAColor {
  const {hue, saturation, brightness, alpha} = rgbToHsbl(color);
  return {hue, saturation, brightness, alpha};
}

export default rgbToHsb;
