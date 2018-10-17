import {BASE_DECIMAL} from '@src/constants';

export default function withinBounds(number, min, max) {
  return (
    number >= parseInt(min, BASE_DECIMAL) &&
    number <= parseInt(max, BASE_DECIMAL)
  );
}
