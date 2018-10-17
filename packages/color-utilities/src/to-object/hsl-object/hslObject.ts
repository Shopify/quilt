import {matchParentheses} from '@utilities';

import {
  COMMA,
  BASE_DECIMAL,
  MIN_HUE,
  MIN_SATURATION,
  MIN_LIGHTNESS,
} from '@constants';
import {HSLColor, HSLAColor} from '@types';

export default function hslObject(color: string): HSLColor | HSLAColor {
  const colorMatch = matchParentheses(color);

  if (!colorMatch) {
    return {
      hue: MIN_HUE,
      saturation: MIN_SATURATION,
      lightness: MIN_LIGHTNESS,
    };
  }

  const [hue, saturation, lightness, alpha] = colorMatch[1].split(COMMA);
  const hslColor = {
    hue: parseInt(hue, BASE_DECIMAL),
    saturation: parseInt(saturation, BASE_DECIMAL),
    lightness: parseFloat(lightness),
  };

  let hslaColor;
  if (alpha) {
    hslaColor = {...hslColor, alpha: parseFloat(alpha)};
  }

  return hslaColor || hslColor;
}

export const hslaObject = hslObject;
