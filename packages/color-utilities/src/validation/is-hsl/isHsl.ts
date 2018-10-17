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
  OBJECT,
  HUE,
  SATURATION,
  LIGHTNESS,
  MIN_HUE,
  MAX_HUE,
  MAX_PERCENT,
  MIN_PERCENT,
  MIN_ALPHA,
  MAX_ALPHA,
  LEN_WITH_ALPHA,
  ALPHA_CHAR,
  LEN_WITHOUT_ALPHA,
} from '@constants';

export default function isHsl(color: any) {
  if (typeof color === STRING) {
    const stringContent = color.match(/^hsla?/);
    if (!stringContent) {
      return false;
    }

    const beg = stringContent[0];
    const numberContent = matchParentheses(color);
    if (numberContent) {
      const [hue, saturation, lightness, alpha] = numberContent[1].split(COMMA);
      if (
        (beg.includes(ALPHA_CHAR) && !alpha) ||
        (!beg.includes(ALPHA_CHAR) && alpha)
      ) {
        return false;
      }

      return (
        withinBounds(hue, MIN_HUE, MAX_HUE) &&
        withinBounds(saturation, MIN_PERCENT, MAX_PERCENT) &&
        withinBounds(lightness, MIN_PERCENT, MAX_PERCENT) &&
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
      hasPropertyInBounds(color, HUE, MIN_HUE, MAX_HUE) &&
      hasPropertyInBounds(color, SATURATION, MIN_PERCENT, MAX_PERCENT) &&
      hasPropertyInBounds(color, LIGHTNESS, MIN_PERCENT, MAX_PERCENT) &&
      hasAlphaPropertyInBounds(color, MIN_ALPHA, MAX_ALPHA)
    );
  }

  return false;
}

export const isHsla = isHsl;
