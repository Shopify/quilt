import {isFutureDate} from './is-future-date';
import {TimeUnit} from './constants';

export function isLessThanOneYearAway(date: Date, now = new Date()) {
  return (
    isFutureDate(date, now) && date.getTime() - now.getTime() < TimeUnit.Year
  );
}
