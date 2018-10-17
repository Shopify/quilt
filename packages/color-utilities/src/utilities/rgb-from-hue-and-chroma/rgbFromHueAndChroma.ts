import {withinBounds} from '@utilities';

import {MIN_RGB} from '@src/constants';

const DIVISOR = 60;

export default function rgbFromHueAndChroma(hue: number, chroma: number) {
  const huePrime = hue / DIVISOR;
  const hueDelta = 1 - Math.abs((huePrime % 2) - 1);
  const intermediateValue = chroma * hueDelta;

  let red = MIN_RGB;
  let green = MIN_RGB;
  let blue = MIN_RGB;
  if (withinBounds(huePrime, 0, 1)) {
    red = chroma;
    green = intermediateValue;
    blue = MIN_RGB;
  }

  if (withinBounds(huePrime, 1, 2)) {
    red = intermediateValue;
    green = chroma;
    blue = MIN_RGB;
  }

  if (withinBounds(huePrime, 2, 3)) {
    red = MIN_RGB;
    green = chroma;
    blue = intermediateValue;
  }

  if (withinBounds(huePrime, 3, 4)) {
    red = MIN_RGB;
    green = intermediateValue;
    blue = chroma;
  }

  if (withinBounds(huePrime, 4, 5)) {
    red = intermediateValue;
    green = MIN_RGB;
    blue = chroma;
  }

  if (withinBounds(huePrime, 5, 6)) {
    red = chroma;
    green = MIN_RGB;
    blue = intermediateValue;
  }

  return {red, green, blue};
}
