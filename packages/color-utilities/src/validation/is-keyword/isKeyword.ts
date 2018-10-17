import {STRING} from '@src/constants';
import {keywords} from '@types';

export default function isKeyword(color: any) {
  return typeof color === STRING ? keywords.includes(color) : false;
}
