import {isLight} from '@manipulation';

import {
  HSLColor,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
} from '@types';

export default function isDark(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
) {
  const isLightColor = isLight(color);
  return isLightColor == null ? undefined : !isLightColor;
}
