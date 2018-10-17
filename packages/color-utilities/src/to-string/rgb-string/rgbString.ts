import {ALPHA, RGBA, RGB, COMMA, PAREN_CLOSE, PAREN_OPEN} from '@constants';
import {RGBColor, RGBAColor} from '@types';

export default function rgbString({
  red,
  green,
  blue,
  ...rest
}: RGBColor | RGBAColor) {
  return rest.hasOwnProperty(ALPHA)
    ? `${RGBA}${PAREN_OPEN}${red}${COMMA} ${green}${COMMA} ${blue}${COMMA} ${
        (rest as RGBAColor)[ALPHA]
      }${PAREN_CLOSE}`
    : `${RGB}${PAREN_OPEN}${red}${COMMA} ${green}${COMMA} ${blue}${PAREN_CLOSE}`;
}

export const rgbaString = rgbString;
