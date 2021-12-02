import {TimeUnit} from './constants';

export function getDateDiff(
  resolution: TimeUnit,
  date: Date,
  today = new Date(),
) {
  return Math.floor((today.getTime() - date.getTime()) / resolution);
}
