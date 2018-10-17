import {hslToRgb, rgbToHex} from '@transforms';

import {HSLColor, HSLAColor} from '@types';

function hslToHex(color: HSLColor): string;
function hslToHex(color: HSLAColor): string;
function hslToHex(color: HSLAColor): string {
  const rgbColor = hslToRgb(color);
  return rgbToHex(rgbColor);
}

export default hslToHex;
