import {matchParentheses} from '@utilities';

import {COMMA, BASE_DECIMAL, MIN_RGB} from '@constants';
import {RGBColor, RGBAColor} from '@types';

export default function rgbObject(color: string): RGBColor | RGBAColor {
  const colorMatch = matchParentheses(color);

  if (!colorMatch) {
    return {red: MIN_RGB, green: MIN_RGB, blue: MIN_RGB};
  }

  const [red, green, blue, alpha] = colorMatch[1].split(COMMA);
  const rgbColor = {
    red: parseInt(red, BASE_DECIMAL),
    green: parseInt(green, BASE_DECIMAL),
    blue: parseInt(blue, BASE_DECIMAL),
  };

  let rgbaColor;
  if (alpha) {
    rgbaColor = {...rgbColor, alpha: parseFloat(alpha)};
  }

  return rgbaColor || rgbColor;
}

export const rgbaObject = rgbObject;
