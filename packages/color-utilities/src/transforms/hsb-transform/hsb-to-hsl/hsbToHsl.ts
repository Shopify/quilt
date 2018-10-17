import {hsbToRgb, rgbToHsl} from '@transforms';

import {HSBColor, HSBAColor, HSLColor} from '@types';

function hsbToHsl(color: HSBColor): HSLColor;
function hsbToHsl(color: HSBAColor): HSLColor;
function hsbToHsl(color: HSBAColor): HSLColor {
  const rgbColor = hsbToRgb(color);
  return rgbToHsl(rgbColor);
}

export default hsbToHsl;
