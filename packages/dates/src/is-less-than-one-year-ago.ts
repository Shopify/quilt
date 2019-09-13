import {isFutureDate} from './is-future-date';
import {TimeUnit} from './constants';

export function isLessThanOneYearAgo(date: Date, now = new Date()) {
  return (
    !isFutureDate(date, now) && now.getTime() - date.getTime() < TimeUnit.Year
  );
}
