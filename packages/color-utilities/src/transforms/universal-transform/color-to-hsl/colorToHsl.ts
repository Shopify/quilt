import {rgbToHsl, hsbToHsl, hexToHsl, keywordToHsl} from '@transforms';
import {colorType} from '@utilities';

import {colorTypes} from '@types';

export default function colorToHsl(color: any) {
  const type = colorType(color);
  switch (type) {
    case colorTypes.KEYWORD:
      return keywordToHsl(color);
    case colorTypes.RGB:
    case colorTypes.RGBA:
      return rgbToHsl(color);
    case colorTypes.HSB:
    case colorTypes.HSBA:
      return hsbToHsl(color);
    case colorTypes.HEX:
      return hexToHsl(color);
    default:
      return color;
  }
}
