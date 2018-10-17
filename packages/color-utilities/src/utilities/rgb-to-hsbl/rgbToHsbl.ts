import {clamp} from '@utilities';

import {
  MAX_RGB,
  MAX_HUE,
  MIN_HUE,
  BASE_DECIMAL_POINTS,
  MIN_SATURATION,
  MAX_SATURATION,
  MIN_BRIGHTNESS,
  MAX_BRIGHTNESS,
  MIN_PERCENT,
  MAX_ALPHA,
} from '@constants';
import {RGBAColor, HSBLAColor, RGBColor, BL, bl} from '@types';

const {B, L} = bl;

export default function rgbToHsbl(
  color: RGBColor | RGBAColor,
  type: BL = B,
): HSBLAColor {
  const {red, green, blue, alpha = MAX_ALPHA} = color as RGBAColor;
  const r = red / MAX_RGB;
  const g = green / MAX_RGB;
  const b = blue / MAX_RGB;

  const largestComponent = Math.max(r, g, b);
  const smallestComponent = Math.min(r, g, b);

  const delta = largestComponent - smallestComponent;
  const lightness = (largestComponent + smallestComponent) / 2;
  let saturation;
  if (largestComponent === 0) {
    saturation = MIN_SATURATION;
  } else if (type === L) {
    saturation =
      lightness > 0.5
        ? delta / (2 - largestComponent - smallestComponent)
        : delta / (largestComponent + smallestComponent);
  } else {
    saturation = delta / largestComponent;
  }

  let huePercentage = MIN_PERCENT;
  switch (largestComponent) {
    case r:
      huePercentage = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      huePercentage = (b - r) / delta + 2;
      break;
    case b:
      huePercentage = (r - g) / delta + 4;
  }

  const hue = Math.round((huePercentage / 6) * MAX_HUE);

  return {
    hue: clamp(hue, MIN_HUE, MAX_HUE) || 0,
    saturation: parseFloat(
      clamp(saturation, MIN_SATURATION, MAX_SATURATION).toFixed(
        BASE_DECIMAL_POINTS,
      ),
    ),
    brightness: parseFloat(
      clamp(largestComponent, MIN_BRIGHTNESS, MAX_BRIGHTNESS).toFixed(
        BASE_DECIMAL_POINTS,
      ),
    ),
    lightness: parseFloat(lightness.toFixed(BASE_DECIMAL_POINTS)),
    alpha: parseFloat(alpha.toFixed(BASE_DECIMAL_POINTS)),
  };
}
