import {hsbToRgb, rgbToHex} from '@transforms';

import {HSBColor, HSBAColor} from '@types';

function hsbToHex(color: HSBColor): string;
function hsbToHex(color: HSBAColor): string;
function hsbToHex(color: HSBAColor): string {
  const rgbColor = hsbToRgb(color);
  return rgbToHex(rgbColor);
}

export default hsbToHex;
