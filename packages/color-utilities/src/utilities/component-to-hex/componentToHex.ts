import {BASE_HEX} from '@constants';

export default function componentToHex(component: number) {
  const hex = component.toString(BASE_HEX);
  return hex.length === 1 ? `0${hex}` : hex;
}
