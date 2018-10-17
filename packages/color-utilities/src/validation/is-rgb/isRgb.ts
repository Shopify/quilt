import {
  matchParentheses,
  withinBounds,
  hasAlphaPropertyInBounds,
  hasPropertyInBounds,
  existsAndWithinBounds,
} from '@utilities';

import {
  ALPHA,
  STRING,
  COMMA,
  MAX_RGB,
  RED,
  GREEN,
  BLUE,
  MIN_RGB,
  OBJECT,
  MIN_ALPHA,
  MAX_ALPHA,
  LEN_WITH_ALPHA,
  ALPHA_CHAR,
  LEN_WITHOUT_ALPHA,
} from '@constants';

export default function isRgb(color: any) {
  if (typeof color === STRING) {
    const stringContent = color.match(/^rgba?/);
    if (!stringContent) {
      return false;
    }

    const beg = stringContent[0];
    const numberContent = matchParentheses(color);
    if (numberContent) {
      const [red, green, blue, alpha] = numberContent[1].split(COMMA);
      if (
        (beg.includes(ALPHA_CHAR) && !alpha) ||
        (!beg.includes(ALPHA_CHAR) && alpha)
      ) {
        return false;
      }

      return (
        withinBounds(red, MIN_RGB, MAX_RGB) &&
        withinBounds(green, MIN_RGB, MAX_RGB) &&
        withinBounds(blue, MIN_RGB, MAX_RGB) &&
        existsAndWithinBounds(alpha, MIN_ALPHA, MAX_ALPHA)
      );
    }
  }

  if (typeof color === OBJECT) {
    if (color == null) {
      return false;
    }

    const keys = Object.keys(color);

    if (
      keys.length > LEN_WITH_ALPHA ||
      (keys.length === LEN_WITH_ALPHA && !color.hasOwnProperty(ALPHA)) ||
      keys.length < LEN_WITHOUT_ALPHA
    ) {
      return false;
    }

    return (
      hasPropertyInBounds(color, RED, MIN_RGB, MAX_RGB) &&
      hasPropertyInBounds(color, GREEN, MIN_RGB, MAX_RGB) &&
      hasPropertyInBounds(color, BLUE, MIN_RGB, MAX_RGB) &&
      hasAlphaPropertyInBounds(color, MIN_ALPHA, MAX_ALPHA)
    );
  }

  return false;
}

export const isRgba = isRgb;
