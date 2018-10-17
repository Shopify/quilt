import {ALPHA, HSLA, HSL, COMMA, PAREN_CLOSE, PAREN_OPEN} from '@constants';
import {HSLColor, HSLAColor} from '@types';

export default function hslString({
  hue,
  saturation,
  lightness,
  ...rest
}: HSLColor | HSLAColor) {
  return rest.hasOwnProperty(ALPHA)
    ? `${HSLA}${PAREN_OPEN}${hue}${COMMA} ${saturation}${COMMA} ${lightness}${COMMA} ${
        (rest as HSLAColor)[ALPHA]
      }${PAREN_CLOSE}`
    : `${HSL}${PAREN_OPEN}${hue}${COMMA} ${saturation}${COMMA} ${lightness}${PAREN_CLOSE}`;
}

export const hslaString = hslString;
