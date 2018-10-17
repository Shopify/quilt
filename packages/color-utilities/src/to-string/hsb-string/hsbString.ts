import {ALPHA, HSBA, HSB, COMMA, PAREN_OPEN, PAREN_CLOSE} from '@constants';
import {HSBColor, HSBAColor} from '@types';

export default function hsbString({
  hue,
  saturation,
  brightness,
  ...rest
}: HSBColor | HSBAColor) {
  return rest.hasOwnProperty(ALPHA)
    ? `${HSBA}${PAREN_OPEN}${hue}${COMMA} ${saturation}${COMMA} ${brightness}${COMMA} ${
        (rest as HSBAColor)[ALPHA]
      }${PAREN_CLOSE}`
    : `${HSB}${PAREN_OPEN}${hue}${COMMA} ${saturation}${COMMA} ${brightness}${PAREN_CLOSE}`;
}

export const hsbaString = hsbString;
