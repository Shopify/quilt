import {hslToRgb, rgbToHsb} from '@transforms';

import {HSLColor} from '@types';

export default function hslToHsb(color: HSLColor) {
  const rgbColor = hslToRgb(color);
  return rgbToHsb(rgbColor);
}
