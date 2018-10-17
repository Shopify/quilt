import {rgbToHsb, hslToHsb, hexToHsb, keywordToHsb} from '@transforms';
import {colorType} from '@utilities';

import {colorTypes} from '@types';

export default function colorToHsb(color: any) {
  const type = colorType(color);
  switch (type) {
    case colorTypes.KEYWORD:
      return keywordToHsb(color);
    case colorTypes.RGB:
    case colorTypes.RGBA:
      return rgbToHsb(color);
    case colorTypes.HSL:
    case colorTypes.HSLA:
      return hslToHsb(color);
    case colorTypes.HEX:
      return hexToHsb(color);
    default:
      return color;
  }
}
