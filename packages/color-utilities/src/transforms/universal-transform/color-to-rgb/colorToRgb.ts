import {keywordToRgb, hslToRgb, hsbToRgb, hexToRgb} from '@transforms';
import {colorType} from '@utilities';

import {colorTypes} from '@types';

export default function colorToRgb(color: any) {
  const type = colorType(color);
  switch (type) {
    case colorTypes.KEYWORD:
      return keywordToRgb(color);
    case colorTypes.HSL:
    case colorTypes.HSLA:
      return hslToRgb(color);
    case colorTypes.HSB:
    case colorTypes.HSBA:
      return hsbToRgb(color);
    case colorTypes.HEX:
      return hexToRgb(color);
    default:
      return color;
  }
}
