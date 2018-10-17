import {rgbToHex, hslToHex, hsbToHex, keywordToHex} from '@transforms';
import {colorType} from '@utilities';

import {colorTypes} from '@types';

export default function colorToHex(color: any) {
  const type = colorType(color);
  switch (type) {
    case colorTypes.KEYWORD:
      return keywordToHex(color);
    case colorTypes.RGB:
    case colorTypes.RGBA:
      return rgbToHex(color);
    case colorTypes.HSL:
    case colorTypes.HSLA:
      return hslToHex(color);
    case colorTypes.HSB:
    case colorTypes.HSBA:
      return hsbToHex(color);
    default:
      return color;
  }
}
