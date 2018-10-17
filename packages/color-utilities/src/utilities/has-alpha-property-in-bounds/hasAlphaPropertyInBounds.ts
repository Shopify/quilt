import {withinBounds} from '@utilities';

import {ALPHA} from '@constants';

export default function hasAlphaPropertyInBounds(color, min, max) {
  if (!color.hasOwnProperty(ALPHA)) {
    return true;
  }

  return withinBounds(color.alpha, min, max);
}
