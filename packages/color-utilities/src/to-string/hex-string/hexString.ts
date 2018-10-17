import {HEX, BASE_DECIMAL_POINTS, LEN_SHORT_HEX} from '@constants';

export default function hexString(color: string) {
  if (color.length !== LEN_SHORT_HEX) {
    return `${HEX}${color}`;
  }

  const repeatHex = (a: number, b: number) =>
    color.slice(a, b).repeat(BASE_DECIMAL_POINTS);
  const first = repeatHex(0, 1);
  const second = repeatHex(1, 2);
  const third = repeatHex(2, 3);

  return `${HEX}${first}${second}${third}`;
}
