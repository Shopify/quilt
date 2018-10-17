import {
  matchParentheses,
  withinBounds,
  hasAlphaPropertyInBounds,
  hasPropertyInBounds,
  existsAndWithinBounds,
} from '@utilities';

import {
  ALPHA,
  COMMA,
  STRING,
  OBJECT,
  HUE,
  SATURATION,
  BRIGHTNESS,
  MIN_HUE,
  MAX_HUE,
  MIN_ALPHA,
  MAX_ALPHA,
  MIN_BRIGHTNESS,
  MAX_BRIGHTNESS,
  MIN_SATURATION,
  MAX_SATURATION,
  LEN_WITH_ALPHA,
  ALPHA_CHAR,
  LEN_WITHOUT_ALPHA,
} from '@constants';

export default function isHsb(color: any) {
  if (typeof color === STRING) {
    const stringContent = color.match(/^hsba?/);
    if (!stringContent) {
      return false;
    }

    const beg = stringContent[0];
    const numberContent = matchParentheses(color);
    if (numberContent) {
      const [hue, saturation, brightness, alpha] = numberContent[1].split(
        COMMA,
      );
      if (
        (beg.includes(ALPHA_CHAR) && !alpha) ||
        (!beg.includes(ALPHA_CHAR) && alpha)
      ) {
        return false;
      }

      return (
        withinBounds(hue, MIN_HUE, MAX_HUE) &&
        withinBounds(saturation, MIN_SATURATION, MAX_SATURATION) &&
        withinBounds(brightness, MIN_BRIGHTNESS, MAX_BRIGHTNESS) &&
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
      hasPropertyInBounds(color, SATURATION, MIN_SATURATION, MAX_SATURATION) &&
      hasPropertyInBounds(color, BRIGHTNESS, MIN_BRIGHTNESS, MAX_BRIGHTNESS) &&
      hasAlphaPropertyInBounds(color, MIN_ALPHA, MAX_ALPHA)
    );
  }

  return false;
}

export const isHsba = isHsb;
