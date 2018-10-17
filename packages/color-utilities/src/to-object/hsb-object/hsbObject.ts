import {matchParentheses} from '@utilities';

import {
  COMMA,
  BASE_DECIMAL,
  MIN_HUE,
  MIN_SATURATION,
  MIN_BRIGHTNESS,
} from '@constants';
import {HSBColor, HSBAColor} from '@types';

export default function hsbObject(color: string): HSBColor | HSBAColor {
  const colorMatch = matchParentheses(color);

  if (!colorMatch) {
    return {
      hue: MIN_HUE,
      saturation: MIN_SATURATION,
      brightness: MIN_BRIGHTNESS,
    };
  }

  const [hue, saturation, brightness, alpha] = colorMatch[1].split(COMMA);
  const hsbColor = {
    hue: parseInt(hue, BASE_DECIMAL),
    saturation: parseInt(saturation, BASE_DECIMAL),
    brightness: parseFloat(brightness),
  };

  let hsbaColor;
  if (alpha) {
    hsbaColor = {...hsbColor, alpha: parseFloat(alpha)};
  }

  return hsbaColor || hsbColor;
}

export const hsbaObject = hsbObject;
