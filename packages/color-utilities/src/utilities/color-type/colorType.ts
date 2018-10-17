import {isKeyword} from '@validation';

import {
  ALPHA,
  RED,
  GREEN,
  BLUE,
  HUE,
  SATURATION,
  LIGHTNESS,
  BRIGHTNESS,
  OBJECT,
  HEX,
  LEN_WITHOUT_ALPHA,
  LEN_WITH_ALPHA,
} from '@constants';
import {
  HSLColor,
  colorTypes,
  RGBColor,
  RGBAColor,
  HSBColor,
  HSBAColor,
  HSLAColor,
  Keywords,
} from '@types';

function colorTypeFromString(color: string): colorTypes {
  if (color.includes(HEX)) {
    return colorTypes.HEX;
  } else if (color.includes(colorTypes.RGBA)) {
    return colorTypes.RGBA;
  } else if (color.includes(colorTypes.RGB)) {
    return colorTypes.RGB;
  } else if (color.includes(colorTypes.HSLA)) {
    return colorTypes.HSLA;
  } else if (color.includes(colorTypes.HSL)) {
    return colorTypes.HSL;
  } else if (color.includes(colorTypes.HSBA)) {
    return colorTypes.HSBA;
  } else if (color.includes(colorTypes.HSB)) {
    return colorTypes.HSB;
  } else if (isKeyword(color)) {
    return colorTypes.KEYWORD;
  } else {
    return colorTypes.DEFAULT;
  }
}

function colorTypeFromObject(
  color: RGBColor | RGBAColor | HSBColor | HSBAColor | HSLColor | HSLAColor,
): colorTypes {
  const len = Object.keys(color).length;
  if (
    RED in color &&
    GREEN in color &&
    BLUE in color &&
    len === LEN_WITHOUT_ALPHA
  ) {
    return colorTypes.RGB;
  } else if (
    RED in color &&
    GREEN in color &&
    BLUE in color &&
    ALPHA in color &&
    len === LEN_WITH_ALPHA
  ) {
    return colorTypes.RGBA;
  } else if (
    HUE in color &&
    SATURATION in color &&
    LIGHTNESS in color &&
    len === LEN_WITHOUT_ALPHA
  ) {
    return colorTypes.HSL;
  } else if (
    HUE in color &&
    SATURATION in color &&
    LIGHTNESS in color &&
    ALPHA in color &&
    len === LEN_WITH_ALPHA
  ) {
    return colorTypes.HSLA;
  } else if (
    HUE in color &&
    SATURATION in color &&
    BRIGHTNESS in color &&
    len === LEN_WITHOUT_ALPHA
  ) {
    return colorTypes.HSB;
  } else if (
    HUE in color &&
    SATURATION in color &&
    BRIGHTNESS in color &&
    ALPHA in color &&
    len === LEN_WITH_ALPHA
  ) {
    return colorTypes.HSBA;
  } else {
    return colorTypes.DEFAULT;
  }
}

export default function colorType(
  color:
    | RGBColor
    | RGBAColor
    | HSBColor
    | HSBAColor
    | HSLColor
    | HSLAColor
    | Keywords
    | string,
): colorTypes {
  return typeof color === OBJECT
    ? colorTypeFromObject(color as any)
    : colorTypeFromString(color as string);
}
