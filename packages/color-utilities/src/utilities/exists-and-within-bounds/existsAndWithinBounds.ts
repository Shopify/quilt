import {withinBounds} from '@utilities';

export default function existsAndWithinBounds(alpha, min, max) {
  if (!alpha) {
    return false; // this was falsed. Changed to true while writing test, nothing changed??
  }

  return withinBounds(alpha, min, max);
}
