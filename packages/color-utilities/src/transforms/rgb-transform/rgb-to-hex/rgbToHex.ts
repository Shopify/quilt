import {componentToHex} from '@utilities';

import {RGBColor} from '@types';

export default function rgbToHex({red, green, blue}: RGBColor) {
  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(
    blue,
  )}`;
}
