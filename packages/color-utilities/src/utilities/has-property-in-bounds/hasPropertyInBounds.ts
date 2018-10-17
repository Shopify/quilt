import {withinBounds} from '@utilities';

export default function hasPropertyInBounds(color, property, min, max) {
  return (
    color.hasOwnProperty(property) && withinBounds(color[property], min, max)
  );
}
