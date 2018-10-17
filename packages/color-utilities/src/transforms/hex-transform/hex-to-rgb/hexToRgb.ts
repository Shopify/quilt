import {BASE_HEX, BASE_DECIMAL_POINTS} from '@constants';

export default function hexToRgb(color: string) {
  if (color.length === 4) {
    const repeatHex = (a: number, b: number) =>
      color.slice(a, b).repeat(BASE_DECIMAL_POINTS);
    const red = parseInt(repeatHex(1, 2), BASE_HEX);
    const green = parseInt(repeatHex(2, 3), BASE_HEX);
    const blue = parseInt(repeatHex(3, 4), BASE_HEX);

    return {red, green, blue};
  }

  const red = parseInt(color.slice(1, 3), BASE_HEX);
  const green = parseInt(color.slice(3, 5), BASE_HEX);
  const blue = parseInt(color.slice(5, 7), BASE_HEX);

  return {red, green, blue};
}
