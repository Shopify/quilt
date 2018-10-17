import {STRING, HEX} from '@constants';

export default function isHex(color: any) {
  return typeof color === STRING && color.includes(HEX);
}
